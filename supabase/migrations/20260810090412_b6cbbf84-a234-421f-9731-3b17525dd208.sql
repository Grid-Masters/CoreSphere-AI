-- ============ A2: delegated authority cleanup ============
ALTER TABLE public.delegations
  ADD CONSTRAINT delegations_capability_only
  CHECK (capability_id IS NOT NULL AND delegated_position_id IS NULL);

CREATE OR REPLACE FUNCTION public.block_delegated_approver_primary()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  code TEXT;
BEGIN
  IF NEW.is_primary AND NEW.status = 'ACTIVE' THEN
    SELECT p.code INTO code FROM public.positions p WHERE p.id = NEW.position_id;
    IF code = 'DELEGATED_APPROVER' THEN
      RAISE EXCEPTION 'DELEGATED_APPROVER is a legacy placeholder and cannot be a primary position assignment. Record a time-bound capability delegation instead.'
        USING ERRCODE = 'P0001';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS position_assignments_block_delegated_approver ON public.position_assignments;
CREATE TRIGGER position_assignments_block_delegated_approver
  BEFORE INSERT OR UPDATE ON public.position_assignments
  FOR EACH ROW EXECUTE FUNCTION public.block_delegated_approver_primary();

-- ============ A3: high-risk legacy authority cleanup ============
-- Knowledge publication is a governed capability, not a legacy broad role.
DROP POLICY IF EXISTS "L&D manages sop versions" ON public.sop_versions;
CREATE POLICY "Knowledge publishers manage sop versions"
  ON public.sop_versions FOR ALL TO authenticated
  USING (public.has_capability(auth.uid(), 'knowledge.record.publish'))
  WITH CHECK (public.has_capability(auth.uid(), 'knowledge.record.publish'));

-- Organisation structure: capability-based, not legacy sysadmin role.
DROP POLICY IF EXISTS "Admins manage departments" ON public.departments;
CREATE POLICY "Organisation managers manage departments"
  ON public.departments FOR ALL TO authenticated
  USING (public.has_capability(auth.uid(), 'platform.organisation.manage'))
  WITH CHECK (public.has_capability(auth.uid(), 'platform.organisation.manage'));

DROP POLICY IF EXISTS "Admins manage sub-departments" ON public.sub_departments;
CREATE POLICY "Organisation managers manage sub-departments"
  ON public.sub_departments FOR ALL TO authenticated
  USING (public.has_capability(auth.uid(), 'platform.organisation.manage'))
  WITH CHECK (public.has_capability(auth.uid(), 'platform.organisation.manage'));

DROP POLICY IF EXISTS "Admins and team leads manage teams" ON public.teams;
CREATE POLICY "Organisation managers and team leads manage teams"
  ON public.teams FOR ALL TO authenticated
  USING (public.has_capability(auth.uid(), 'platform.organisation.manage') OR team_lead_id = auth.uid())
  WITH CHECK (public.has_capability(auth.uid(), 'platform.organisation.manage') OR team_lead_id = auth.uid());

DROP POLICY IF EXISTS "Admins and team leads manage members" ON public.team_members;
CREATE POLICY "Organisation managers and team leads manage members"
  ON public.team_members FOR ALL TO authenticated
  USING (
    public.has_capability(auth.uid(), 'platform.organisation.manage')
    OR EXISTS (SELECT 1 FROM public.teams t WHERE t.id = team_members.team_id AND t.team_lead_id = auth.uid())
  )
  WITH CHECK (
    public.has_capability(auth.uid(), 'platform.organisation.manage')
    OR EXISTS (SELECT 1 FROM public.teams t WHERE t.id = team_members.team_id AND t.team_lead_id = auth.uid())
  );

DROP POLICY IF EXISTS "Members see their own team assignment" ON public.team_members;
CREATE POLICY "Members see their own team assignment"
  ON public.team_members FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_capability(auth.uid(), 'platform.organisation.manage'));

-- Identity administration: capability-based.
DROP POLICY IF EXISTS "platform admin manages position capabilities" ON public.position_capabilities;
CREATE POLICY "Identity managers manage position capabilities"
  ON public.position_capabilities FOR ALL TO authenticated
  USING (public.has_capability(auth.uid(), 'platform.identity.manage'))
  WITH CHECK (public.has_capability(auth.uid(), 'platform.identity.manage'));

DROP POLICY IF EXISTS "platform admin manages capability grants" ON public.user_capability_grants;
CREATE POLICY "Identity managers manage capability grants"
  ON public.user_capability_grants FOR ALL TO authenticated
  USING (public.has_capability(auth.uid(), 'platform.identity.manage'))
  WITH CHECK (public.has_capability(auth.uid(), 'platform.identity.manage'));

-- Recognition content is operational: the technical administrator is removed.
DROP POLICY IF EXISTS "L&D and admins manage recognition archives" ON public.recognition_archives;
CREATE POLICY "L&D and leadership manage recognition archives"
  ON public.recognition_archives FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'ld') OR public.has_role(auth.uid(), 'group_head'))
  WITH CHECK (public.has_role(auth.uid(), 'ld') OR public.has_role(auth.uid(), 'group_head'));

DROP POLICY IF EXISTS "L&D and admins manage recognition photos" ON public.recognition_photos;
CREATE POLICY "L&D and leadership manage recognition photos"
  ON public.recognition_photos FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'ld') OR public.has_role(auth.uid(), 'group_head'))
  WITH CHECK (public.has_role(auth.uid(), 'ld') OR public.has_role(auth.uid(), 'group_head'));

-- ============ A4: foundation indexes ============
CREATE INDEX IF NOT EXISTS idx_user_sessions_active_user
  ON public.user_sessions (user_id, login_at DESC) WHERE ended_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_audit_events_created_at
  ON public.audit_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_events_user_created
  ON public.audit_events (user_id, created_at DESC);