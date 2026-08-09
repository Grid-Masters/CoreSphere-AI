-- ============ Helpers ============
CREATE OR REPLACE FUNCTION public.org_unit_and_descendants(_root uuid)
RETURNS TABLE(unit_id uuid)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH RECURSIVE tree AS (
    SELECT ou.id FROM public.organisation_units ou WHERE ou.id = _root
    UNION
    SELECT c.id FROM public.organisation_units c JOIN tree t ON c.parent_unit_id = t.id
  )
  SELECT id FROM tree;
$$;

REVOKE ALL ON FUNCTION public.org_unit_and_descendants(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.org_unit_and_descendants(uuid) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.can_view_profile(_target_user uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    _target_user = auth.uid()
    OR public.has_capability(auth.uid(), 'platform.identity.manage')
    OR EXISTS (
      SELECT 1
      FROM public.position_assignments va
      JOIN public.positions vp ON vp.id = va.position_id
      WHERE va.user_id = auth.uid()
        AND va.status = 'ACTIVE' AND va.is_primary
        AND va.effective_from <= CURRENT_DATE
        AND (va.effective_to IS NULL OR va.effective_to >= CURRENT_DATE)
        AND vp.code IN ('HEAD_CFC_OPERATIONS','GROUP_HEAD')
    )
    OR EXISTS (
      SELECT 1
      FROM public.position_assignments va
      JOIN public.positions vp ON vp.id = va.position_id
      JOIN public.position_assignments ta ON ta.user_id = _target_user
      WHERE va.user_id = auth.uid()
        AND va.status = 'ACTIVE' AND va.is_primary
        AND va.effective_from <= CURRENT_DATE
        AND (va.effective_to IS NULL OR va.effective_to >= CURRENT_DATE)
        AND vp.code IN ('TEAM_LEAD','UNIT_HEAD')
        AND ta.status = 'ACTIVE' AND ta.is_primary
        AND ta.effective_from <= CURRENT_DATE
        AND (ta.effective_to IS NULL OR ta.effective_to >= CURRENT_DATE)
        AND ta.organisation_unit_id IN (
          SELECT d.unit_id FROM public.org_unit_and_descendants(va.organisation_unit_id) d
        )
    );
$$;

REVOKE ALL ON FUNCTION public.can_view_profile(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.can_view_profile(uuid) TO authenticated, service_role;

-- ============ profiles ============
DROP POLICY IF EXISTS "Leaders view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Identity managers view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;

CREATE POLICY "Scoped profile visibility"
ON public.profiles FOR SELECT TO authenticated
USING (public.can_view_profile(user_id));

REVOKE INSERT, UPDATE, DELETE ON public.profiles FROM authenticated;
GRANT SELECT ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

-- ============ user_sessions ============
ALTER TABLE public.user_sessions ADD COLUMN IF NOT EXISTS is_demo boolean NOT NULL DEFAULT false;

DROP POLICY IF EXISTS "Users insert their own sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Users update their own sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Users see their own sessions" ON public.user_sessions;

CREATE POLICY "Users read own sessions"
ON public.user_sessions FOR SELECT TO authenticated
USING (user_id = auth.uid());

REVOKE INSERT, UPDATE, DELETE ON public.user_sessions FROM authenticated;
GRANT SELECT ON public.user_sessions TO authenticated;
GRANT ALL ON public.user_sessions TO service_role;

-- ============ audit_events ============
DROP POLICY IF EXISTS "Signed-in users can insert audit events" ON public.audit_events;
DROP POLICY IF EXISTS "Users see their own audit events" ON public.audit_events;

CREATE POLICY "Own or audit-capability read"
ON public.audit_events FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.has_capability(auth.uid(), 'platform.audit.view'));

REVOKE INSERT, UPDATE, DELETE ON public.audit_events FROM authenticated;
GRANT SELECT ON public.audit_events TO authenticated;
GRANT ALL ON public.audit_events TO service_role;

-- ============ trusted_networks ============
DROP POLICY IF EXISTS "Anyone signed in can view trusted networks" ON public.trusted_networks;
DROP POLICY IF EXISTS "Admins manage trusted networks" ON public.trusted_networks;

CREATE POLICY "Security capability manages trusted networks"
ON public.trusted_networks FOR ALL TO authenticated
USING (public.has_capability(auth.uid(), 'platform.security.manage'))
WITH CHECK (public.has_capability(auth.uid(), 'platform.security.manage'));

-- ============ certificates ============
DROP POLICY IF EXISTS "Users insert own certificates" ON public.certificates;
DROP POLICY IF EXISTS "Users update own certificates" ON public.certificates;
DROP POLICY IF EXISTS "Users delete own certificates" ON public.certificates;
DROP POLICY IF EXISTS "Leaders view all certificates" ON public.certificates;

REVOKE INSERT, UPDATE, DELETE ON public.certificates FROM authenticated;
GRANT SELECT ON public.certificates TO authenticated;
GRANT ALL ON public.certificates TO service_role;

-- ============ risk_snapshots ============
DROP POLICY IF EXISTS "System insert risk via service role" ON public.risk_snapshots;
DROP POLICY IF EXISTS "Leaders view all risk" ON public.risk_snapshots;

REVOKE INSERT, UPDATE, DELETE ON public.risk_snapshots FROM authenticated;
GRANT SELECT ON public.risk_snapshots TO authenticated;
GRANT ALL ON public.risk_snapshots TO service_role;

-- ============ approved_quotes ============
DROP POLICY IF EXISTS "Anyone can read active approved quotes" ON public.approved_quotes;
DROP POLICY IF EXISTS "L&D and admins can insert quote drafts" ON public.approved_quotes;
DROP POLICY IF EXISTS "L&D and admins can update quotes" ON public.approved_quotes;
DROP POLICY IF EXISTS "Admins can delete quotes" ON public.approved_quotes;

CREATE POLICY "Signed-in users read active approved quotes"
ON public.approved_quotes FOR SELECT TO authenticated
USING (is_active = true AND approved_at IS NOT NULL);

REVOKE ALL ON public.approved_quotes FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.approved_quotes FROM authenticated;
GRANT SELECT ON public.approved_quotes TO authenticated;
GRANT ALL ON public.approved_quotes TO service_role;

-- ============ hard_tokens (server-only) ============
DROP POLICY IF EXISTS "Admins manage hard tokens" ON public.hard_tokens;
DROP POLICY IF EXISTS "Users see their own token" ON public.hard_tokens;

REVOKE ALL ON public.hard_tokens FROM authenticated, anon;
GRANT ALL ON public.hard_tokens TO service_role;

-- ============ replace legacy sysadmin admin policies with capabilities ============
DROP POLICY IF EXISTS "platform admin manages capabilities" ON public.capabilities;
CREATE POLICY "configuration capability manages capabilities"
ON public.capabilities FOR ALL TO authenticated
USING (public.has_capability(auth.uid(), 'platform.configuration.manage'))
WITH CHECK (public.has_capability(auth.uid(), 'platform.configuration.manage'));

DROP POLICY IF EXISTS "platform admin manages positions" ON public.positions;
CREATE POLICY "organisation capability manages positions"
ON public.positions FOR ALL TO authenticated
USING (public.has_capability(auth.uid(), 'platform.organisation.manage'))
WITH CHECK (public.has_capability(auth.uid(), 'platform.organisation.manage'));

DROP POLICY IF EXISTS "platform admin manages org units" ON public.organisation_units;
CREATE POLICY "organisation capability manages org units"
ON public.organisation_units FOR ALL TO authenticated
USING (public.has_capability(auth.uid(), 'platform.organisation.manage'))
WITH CHECK (public.has_capability(auth.uid(), 'platform.organisation.manage'));

DROP POLICY IF EXISTS "platform admin manages assignments" ON public.position_assignments;
CREATE POLICY "identity capability manages assignments"
ON public.position_assignments FOR ALL TO authenticated
USING (public.has_capability(auth.uid(), 'platform.identity.manage'))
WITH CHECK (public.has_capability(auth.uid(), 'platform.identity.manage'));

DROP POLICY IF EXISTS "platform admin manages delegations" ON public.delegations;
CREATE POLICY "identity capability manages delegations"
ON public.delegations FOR ALL TO authenticated
USING (public.has_capability(auth.uid(), 'platform.identity.manage'))
WITH CHECK (public.has_capability(auth.uid(), 'platform.identity.manage'));