-- A1: identity helpers bind strictly to the verified authenticated actor.
CREATE OR REPLACE FUNCTION public.helper_actor_allowed(_user uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT _user IS NOT NULL AND auth.uid() IS NOT NULL AND _user = auth.uid();
$$;

-- A2: NULL organisation is NOT unrestricted scope; enterprise authority explicit.
CREATE OR REPLACE FUNCTION public.capability_in_scope(_user uuid, _code text, _org_unit uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT public.helper_actor_allowed(_user)
     AND public.has_capability(_user, _code)
     AND (
       public.user_is_enterprise(_user)
       OR (
         _org_unit IS NOT NULL
         AND public.user_primary_org_unit(_user) IS NOT NULL
         AND _org_unit IN (
           SELECT d.unit_id
           FROM public.org_unit_and_descendants(public.user_primary_org_unit(_user)) d
         )
       )
     );
$$;

-- A3: creator identity is no longer an unconditional management bypass.
CREATE OR REPLACE FUNCTION public.can_manage_publication(_pub uuid, _user uuid)
RETURNS boolean LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE
  ptype text;
  owner_unit uuid;
  codes text[];
  c text;
BEGIN
  IF _user IS NULL OR _user <> auth.uid() THEN RETURN false; END IF;
  SELECT p.publication_type, p.owner_org_unit_id
    INTO ptype, owner_unit
  FROM public.publications p WHERE p.id = _pub;
  IF ptype IS NULL THEN RETURN false; END IF;

  codes := CASE ptype
    WHEN 'FAQ' THEN ARRAY['publication.faq.manage_team','publication.faq.approve_department']
    WHEN 'ALERT' THEN ARRAY['publication.alert.publish_enterprise']
    WHEN 'MEMO' THEN ARRAY['publication.memo.publish_enterprise']
    WHEN 'LEADERSHIP' THEN ARRAY['publication.leadership.publish']
    WHEN 'TOWNHALL' THEN ARRAY['publication.townhall.create','publication.townhall.review','publication.townhall.publish']
    WHEN 'LEARNING_PULSE' THEN ARRAY['publication.learning_pulse.create','publication.learning_pulse.review','publication.learning_pulse.publish']
    ELSE ARRAY[]::text[]
  END;

  FOREACH c IN ARRAY codes LOOP
    IF public.capability_in_scope(_user, c, owner_unit) THEN RETURN true; END IF;
  END LOOP;
  RETURN false;
END;
$$;

-- A4: receipts are self-owned, immutable in identity, server-timestamped.
CREATE OR REPLACE FUNCTION public.enforce_publication_receipt_integrity()
RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public'
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF auth.uid() IS NOT NULL THEN
      NEW.user_id := auth.uid();
    END IF;
    IF NEW.user_id IS NULL THEN
      RAISE EXCEPTION 'A receipt must belong to an authenticated user.' USING ERRCODE = 'P0001';
    END IF;
    NEW.viewed_at := CASE WHEN NEW.viewed_at IS NULL THEN NULL ELSE now() END;
    NEW.acknowledged_at := CASE WHEN NEW.acknowledged_at IS NULL THEN NULL ELSE now() END;
    NEW.created_at := now();
    NEW.updated_at := now();
    RETURN NEW;
  END IF;

  IF NEW.user_id IS DISTINCT FROM OLD.user_id
     OR NEW.publication_id IS DISTINCT FROM OLD.publication_id
     OR NEW.created_at IS DISTINCT FROM OLD.created_at THEN
    RAISE EXCEPTION 'Receipt ownership, publication and creation time are immutable.' USING ERRCODE = 'P0001';
  END IF;

  -- Timestamps are server-generated and monotonic: never cleared, never backdated.
  NEW.viewed_at := COALESCE(OLD.viewed_at, CASE WHEN NEW.viewed_at IS NULL THEN NULL ELSE now() END);
  NEW.acknowledged_at := COALESCE(OLD.acknowledged_at, CASE WHEN NEW.acknowledged_at IS NULL THEN NULL ELSE now() END);
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS publication_receipts_integrity ON public.publication_receipts;
CREATE TRIGGER publication_receipts_integrity
BEFORE INSERT OR UPDATE ON public.publication_receipts
FOR EACH ROW EXECUTE FUNCTION public.enforce_publication_receipt_integrity();

-- Idempotent, visibility-checked receipt recording.
CREATE OR REPLACE FUNCTION public.record_publication_receipt(_pub uuid, _acknowledge boolean DEFAULT false)
RETURNS public.publication_receipts
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE
  actor uuid := auth.uid();
  row_out public.publication_receipts;
BEGIN
  IF actor IS NULL THEN
    RAISE EXCEPTION 'Authentication required.' USING ERRCODE = '42501';
  END IF;
  IF NOT public.can_view_publication(_pub, actor) THEN
    RAISE EXCEPTION 'Not authorised for this publication.' USING ERRCODE = '42501';
  END IF;

  INSERT INTO public.publication_receipts (publication_id, user_id, viewed_at, acknowledged_at)
  VALUES (_pub, actor, now(), CASE WHEN _acknowledge THEN now() ELSE NULL END)
  ON CONFLICT (publication_id, user_id) DO UPDATE
    SET viewed_at = COALESCE(public.publication_receipts.viewed_at, now()),
        acknowledged_at = CASE
          WHEN _acknowledge THEN COALESCE(public.publication_receipts.acknowledged_at, now())
          ELSE public.publication_receipts.acknowledged_at END
  RETURNING * INTO row_out;

  RETURN row_out;
END;
$$;

REVOKE ALL ON FUNCTION public.record_publication_receipt(uuid, boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.record_publication_receipt(uuid, boolean) TO authenticated;
REVOKE ALL ON FUNCTION public.helper_actor_allowed(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.capability_in_scope(uuid, text, uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.can_manage_publication(uuid, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.helper_actor_allowed(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.capability_in_scope(uuid, text, uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.can_manage_publication(uuid, uuid) TO authenticated, service_role;