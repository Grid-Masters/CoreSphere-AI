-- ============================================================
-- Pre-Package-D backend remediation: scope helpers, publication
-- audience enforcement (C-R11), knowledge serviceability (R05),
-- conflict decision authority reconciliation (C-R10).
-- Additive only. No table drops, no demo data rewrites.
-- ============================================================

-- ---------- C-R10: conflict decision authority reconciliation ----------
-- Baseline authority model: L&D Unit Head is approval/recommendation
-- authority (review), Head of CFC Operations is the operational conflict
-- decision authority, Group Head is final intervention.
DELETE FROM public.position_capabilities pc
USING public.capabilities c, public.positions p
WHERE pc.capability_id = c.id
  AND pc.position_id = p.id
  AND c.code = 'knowledge.conflict.decide'
  AND p.code = 'LD_UNIT_HEAD';

-- ---------- Scope helpers ----------
CREATE OR REPLACE FUNCTION public.user_primary_org_unit(_user uuid)
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT pa.organisation_unit_id
  FROM public.position_assignments pa
  WHERE pa.user_id = _user
    AND pa.status = 'ACTIVE' AND pa.is_primary
    AND pa.effective_from <= CURRENT_DATE
    AND (pa.effective_to IS NULL OR pa.effective_to >= CURRENT_DATE)
  ORDER BY pa.effective_from DESC
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.user_position_code(_user uuid)
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT p.code
  FROM public.position_assignments pa
  JOIN public.positions p ON p.id = pa.position_id
  WHERE pa.user_id = _user
    AND pa.status = 'ACTIVE' AND pa.is_primary
    AND pa.effective_from <= CURRENT_DATE
    AND (pa.effective_to IS NULL OR pa.effective_to >= CURRENT_DATE)
  ORDER BY pa.effective_from DESC
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.user_country(_user uuid)
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE(
    (SELECT pr.country_code FROM public.profiles pr WHERE pr.user_id = _user LIMIT 1),
    (SELECT ou.country_code FROM public.organisation_units ou
      WHERE ou.id = public.user_primary_org_unit(_user))
  );
$$;

CREATE OR REPLACE FUNCTION public.user_is_enterprise(_user uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.user_position_code(_user) IN ('GROUP_HEAD','HEAD_CFC_OPERATIONS');
$$;

-- Capability possession AND organisational scope. NULL _org_unit means the
-- object carries no organisational anchor, so possession alone applies.
CREATE OR REPLACE FUNCTION public.capability_in_scope(_user uuid, _code text, _org_unit uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_capability(_user, _code)
     AND (
       _org_unit IS NULL
       OR public.user_is_enterprise(_user)
       OR _org_unit IN (
         SELECT d.unit_id
         FROM public.org_unit_and_descendants(public.user_primary_org_unit(_user)) d
       )
     );
$$;

-- ---------- Publication audience + visibility ----------
CREATE OR REPLACE FUNCTION public.publication_audience_matches(_pub uuid, _user uuid)
RETURNS boolean LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE
  has_include boolean;
  matched boolean;
  excluded boolean;
BEGIN
  IF _user IS NULL THEN RETURN false; END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.publication_audience_rules r
    WHERE r.publication_id = _pub AND r.rule_type = 'INCLUDE'
  ) INTO has_include;

  SELECT EXISTS (
    SELECT 1 FROM public.publication_audience_rules r
    WHERE r.publication_id = _pub AND r.rule_type = 'EXCLUDE'
      AND (r.country_code IS NULL OR r.country_code = public.user_country(_user))
      AND (r.position_id IS NULL OR r.position_id = (
            SELECT pa.position_id FROM public.position_assignments pa
            WHERE pa.user_id = _user AND pa.status = 'ACTIVE' AND pa.is_primary LIMIT 1))
      AND (
        r.org_unit_id IS NULL
        OR (r.include_descendants AND public.user_primary_org_unit(_user) IN (
              SELECT d.unit_id FROM public.org_unit_and_descendants(r.org_unit_id) d))
        OR (NOT r.include_descendants AND r.org_unit_id = public.user_primary_org_unit(_user))
      )
  ) INTO excluded;

  -- Exclusions always override inclusions.
  IF excluded THEN RETURN false; END IF;
  IF NOT has_include THEN RETURN false; END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.publication_audience_rules r
    WHERE r.publication_id = _pub AND r.rule_type = 'INCLUDE'
      AND (r.country_code IS NULL OR r.country_code = public.user_country(_user))
      AND (r.position_id IS NULL OR r.position_id = (
            SELECT pa.position_id FROM public.position_assignments pa
            WHERE pa.user_id = _user AND pa.status = 'ACTIVE' AND pa.is_primary LIMIT 1))
      AND (
        r.org_unit_id IS NULL
        OR (r.include_descendants AND public.user_primary_org_unit(_user) IN (
              SELECT d.unit_id FROM public.org_unit_and_descendants(r.org_unit_id) d))
        OR (NOT r.include_descendants AND r.org_unit_id = public.user_primary_org_unit(_user))
      )
  ) INTO matched;

  RETURN COALESCE(matched, false);
END;
$$;

CREATE OR REPLACE FUNCTION public.publication_is_current(_pub uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.publications p
    WHERE p.id = _pub
      AND p.status = 'PUBLISHED'
      AND (p.effective_from IS NULL OR p.effective_from <= now())
      AND (p.effective_to IS NULL OR p.effective_to >= now())
  );
$$;

-- Management/oversight boundary: capability appropriate to the publication
-- type, scoped to the owning organisational unit.
CREATE OR REPLACE FUNCTION public.can_manage_publication(_pub uuid, _user uuid)
RETURNS boolean LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE
  ptype text;
  owner_unit uuid;
  creator uuid;
  codes text[];
  c text;
BEGIN
  IF _user IS NULL THEN RETURN false; END IF;
  SELECT p.publication_type, p.owner_org_unit_id, p.created_by
    INTO ptype, owner_unit, creator
  FROM public.publications p WHERE p.id = _pub;
  IF ptype IS NULL THEN RETURN false; END IF;
  IF creator = _user THEN RETURN true; END IF;

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

CREATE OR REPLACE FUNCTION public.can_view_publication(_pub uuid, _user uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT _user IS NOT NULL
     AND (
       (public.publication_is_current(_pub) AND public.publication_audience_matches(_pub, _user))
       OR public.can_manage_publication(_pub, _user)
     );
$$;

-- ---------- Canonical knowledge serviceability (R05 primitive) ----------
CREATE OR REPLACE FUNCTION public.knowledge_version_serviceable(_version uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.knowledge_record_versions v
    JOIN public.knowledge_records r ON r.id = v.knowledge_record_id
    WHERE v.id = _version
      AND v.workflow_status IN ('APPROVED','PUBLISHED')
      AND r.status = 'ACTIVE'
      AND (v.effective_from IS NULL OR v.effective_from <= CURRENT_DATE)
      AND (v.effective_to IS NULL OR v.effective_to >= CURRENT_DATE)
      AND NOT EXISTS (
        SELECT 1 FROM public.supersession_links sl
        WHERE sl.superseded_version_id = v.id AND sl.effective_from <= CURRENT_DATE
      )
      AND NOT EXISTS (
        SELECT 1
        FROM public.conflict_items ci
        JOIN public.knowledge_conflict_cases kc ON kc.id = ci.conflict_case_id
        WHERE ci.knowledge_version_id = v.id
          AND kc.status NOT IN ('RESOLVED','CLOSED','DISMISSED')
      )
  );
$$;

CREATE OR REPLACE FUNCTION public.knowledge_placement_audience_matches(_placement uuid, _user uuid)
RETURNS boolean LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE
  has_include boolean;
  matched boolean;
  excluded boolean;
  upos uuid;
  uunit uuid;
  uctry text;
BEGIN
  IF _user IS NULL THEN RETURN false; END IF;
  uunit := public.user_primary_org_unit(_user);
  uctry := public.user_country(_user);
  SELECT pa.position_id INTO upos FROM public.position_assignments pa
   WHERE pa.user_id = _user AND pa.status = 'ACTIVE' AND pa.is_primary LIMIT 1;

  SELECT EXISTS (SELECT 1 FROM public.audience_rules a
     WHERE a.knowledge_placement_id = _placement AND a.rule_type = 'INCLUDE') INTO has_include;

  SELECT EXISTS (
    SELECT 1 FROM public.audience_rules a
    WHERE a.knowledge_placement_id = _placement AND a.rule_type = 'EXCLUDE'
      AND (a.effective_from IS NULL OR a.effective_from <= CURRENT_DATE)
      AND (a.effective_to IS NULL OR a.effective_to >= CURRENT_DATE)
      AND (a.country_code IS NULL OR a.country_code = uctry)
      AND (a.position_id IS NULL OR a.position_id = upos)
      AND (a.org_unit_id IS NULL
           OR (a.include_descendants AND uunit IN (SELECT d.unit_id FROM public.org_unit_and_descendants(a.org_unit_id) d))
           OR (NOT a.include_descendants AND a.org_unit_id = uunit))
  ) INTO excluded;

  IF excluded THEN RETURN false; END IF;
  IF NOT has_include THEN RETURN false; END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.audience_rules a
    WHERE a.knowledge_placement_id = _placement AND a.rule_type = 'INCLUDE'
      AND (a.effective_from IS NULL OR a.effective_from <= CURRENT_DATE)
      AND (a.effective_to IS NULL OR a.effective_to >= CURRENT_DATE)
      AND (a.country_code IS NULL OR a.country_code = uctry)
      AND (a.position_id IS NULL OR a.position_id = upos)
      AND (a.org_unit_id IS NULL
           OR (a.include_descendants AND uunit IN (SELECT d.unit_id FROM public.org_unit_and_descendants(a.org_unit_id) d))
           OR (NOT a.include_descendants AND a.org_unit_id = uunit))
  ) INTO matched;

  RETURN COALESCE(matched, false);
END;
$$;

CREATE OR REPLACE FUNCTION public.can_view_knowledge_version(_version uuid, _user uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT _user IS NOT NULL
     AND public.knowledge_version_serviceable(_version)
     AND EXISTS (
       SELECT 1 FROM public.knowledge_placements kp
       WHERE kp.knowledge_version_id = _version
         AND kp.placement_status = 'APPROVED'
         AND public.knowledge_placement_audience_matches(kp.id, _user)
     );
$$;

-- ---------- Least-privilege execute grants ----------
DO $$
DECLARE fn text;
BEGIN
  FOREACH fn IN ARRAY ARRAY[
    'public.user_primary_org_unit(uuid)',
    'public.user_position_code(uuid)',
    'public.user_country(uuid)',
    'public.user_is_enterprise(uuid)',
    'public.capability_in_scope(uuid,text,uuid)',
    'public.publication_audience_matches(uuid,uuid)',
    'public.publication_is_current(uuid)',
    'public.can_manage_publication(uuid,uuid)',
    'public.can_view_publication(uuid,uuid)',
    'public.knowledge_version_serviceable(uuid)',
    'public.knowledge_placement_audience_matches(uuid,uuid)',
    'public.can_view_knowledge_version(uuid,uuid)'
  ] LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC', fn);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO authenticated, service_role', fn);
  END LOOP;
END $$;

-- ---------- C-R11: publication RLS hardening ----------
DROP POLICY IF EXISTS "Publications readable by publication governance" ON public.publications;
CREATE POLICY "Publications readable by audience or scoped governance"
ON public.publications FOR SELECT TO authenticated
USING (public.can_view_publication(id, auth.uid()));

DROP POLICY IF EXISTS "Publication assets readable with their publication" ON public.publication_assets;
CREATE POLICY "Publication assets inherit publication visibility"
ON public.publication_assets FOR SELECT TO authenticated
USING (public.can_view_publication(publication_id, auth.uid()));

DROP POLICY IF EXISTS "Audience rules readable by publication governance" ON public.publication_audience_rules;
CREATE POLICY "Audience rules readable by scoped publication governance"
ON public.publication_audience_rules FOR SELECT TO authenticated
USING (public.can_manage_publication(publication_id, auth.uid()));

-- Self-only, verified receipts.
DROP POLICY IF EXISTS "Own publication receipts" ON public.publication_receipts;
CREATE POLICY "Own publication receipts readable"
ON public.publication_receipts FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Own publication receipts insertable"
ON public.publication_receipts FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid() AND public.can_view_publication(publication_id, auth.uid()));

CREATE POLICY "Own publication receipts updatable"
ON public.publication_receipts FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE UNIQUE INDEX IF NOT EXISTS publication_receipts_unique_user
  ON public.publication_receipts (publication_id, user_id);

GRANT SELECT, INSERT, UPDATE ON public.publication_receipts TO authenticated;
GRANT ALL ON public.publication_receipts TO service_role;

-- ---------- Supporting indexes ----------
CREATE INDEX IF NOT EXISTS source_document_versions_sha256_idx
  ON public.source_document_versions (sha256) WHERE sha256 IS NOT NULL;
CREATE INDEX IF NOT EXISTS conflict_items_version_idx
  ON public.conflict_items (knowledge_version_id);
CREATE INDEX IF NOT EXISTS supersession_superseded_idx
  ON public.supersession_links (superseded_version_id);
CREATE INDEX IF NOT EXISTS knowledge_placements_version_idx
  ON public.knowledge_placements (knowledge_version_id);
