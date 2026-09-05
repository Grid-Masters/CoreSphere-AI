-- Self-scope guard: an ordinary signed-in caller may only ask these helpers
-- about themselves. Trusted server code (service_role) is unrestricted.
CREATE OR REPLACE FUNCTION public.helper_actor_allowed(_user uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT current_user IN ('service_role','postgres','supabase_admin')
      OR (_user IS NOT NULL AND _user = auth.uid());
$$;
REVOKE ALL ON FUNCTION public.helper_actor_allowed(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.helper_actor_allowed(uuid) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.user_primary_org_unit(_user uuid)
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT pa.organisation_unit_id
  FROM public.position_assignments pa
  WHERE public.helper_actor_allowed(_user)
    AND pa.user_id = _user
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
  WHERE public.helper_actor_allowed(_user)
    AND pa.user_id = _user
    AND pa.status = 'ACTIVE' AND pa.is_primary
    AND pa.effective_from <= CURRENT_DATE
    AND (pa.effective_to IS NULL OR pa.effective_to >= CURRENT_DATE)
  ORDER BY pa.effective_from DESC
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.user_country(_user uuid)
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT CASE WHEN NOT public.helper_actor_allowed(_user) THEN NULL ELSE COALESCE(
    (SELECT pr.country_code FROM public.profiles pr WHERE pr.user_id = _user LIMIT 1),
    (SELECT ou.country_code FROM public.organisation_units ou
      WHERE ou.id = public.user_primary_org_unit(_user))
  ) END;
$$;

CREATE OR REPLACE FUNCTION public.capability_in_scope(_user uuid, _code text, _org_unit uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.helper_actor_allowed(_user)
     AND public.has_capability(_user, _code)
     AND (
       _org_unit IS NULL
       OR public.user_is_enterprise(_user)
       OR _org_unit IN (
         SELECT d.unit_id
         FROM public.org_unit_and_descendants(public.user_primary_org_unit(_user)) d
       )
     );
$$;

REVOKE ALL ON FUNCTION public.user_primary_org_unit(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.user_position_code(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.user_country(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.capability_in_scope(uuid,text,uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.user_primary_org_unit(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.user_position_code(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.user_country(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.capability_in_scope(uuid,text,uuid) TO authenticated, service_role;
