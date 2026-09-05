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
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC, anon', fn);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO authenticated, service_role', fn);
  END LOOP;
END $$;

-- hard_tokens had RLS enabled with no policy at all; make the intent explicit
-- and self-scoped. Registration/verification remains server-authored.
GRANT SELECT ON public.hard_tokens TO authenticated;
GRANT ALL ON public.hard_tokens TO service_role;
CREATE POLICY "Own hard token registration readable"
ON public.hard_tokens FOR SELECT TO authenticated
USING (user_id = auth.uid());
