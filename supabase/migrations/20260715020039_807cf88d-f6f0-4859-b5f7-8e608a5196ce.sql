-- =========================================================================
-- Blueprint 01A — Platform Foundation
-- =========================================================================

-- ---------- DEPARTMENTS ----------
CREATE TABLE public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.departments TO authenticated;
GRANT ALL ON public.departments TO service_role;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone signed in can view departments" ON public.departments
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage departments" ON public.departments
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'sysadmin'))
  WITH CHECK (public.has_role(auth.uid(), 'sysadmin'));

-- ---------- SUB-DEPARTMENTS ----------
CREATE TABLE public.sub_departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (department_id, name)
);
GRANT SELECT ON public.sub_departments TO authenticated;
GRANT ALL ON public.sub_departments TO service_role;
ALTER TABLE public.sub_departments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone signed in can view sub-departments" ON public.sub_departments
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage sub-departments" ON public.sub_departments
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'sysadmin'))
  WITH CHECK (public.has_role(auth.uid(), 'sysadmin'));

-- ---------- TEAMS ----------
CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE RESTRICT,
  sub_department_id UUID REFERENCES public.sub_departments(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  team_lead_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (department_id, name)
);
GRANT SELECT ON public.teams TO authenticated;
GRANT ALL ON public.teams TO service_role;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone signed in can view teams" ON public.teams
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins and team leads manage teams" ON public.teams
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'sysadmin') OR team_lead_id = auth.uid())
  WITH CHECK (public.has_role(auth.uid(), 'sysadmin') OR team_lead_id = auth.uid());

-- ---------- TEAM MEMBERS ----------
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  removed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- A user can only be active on ONE team at a time.
CREATE UNIQUE INDEX team_members_one_active_per_user
  ON public.team_members (user_id) WHERE is_active = true;
GRANT SELECT ON public.team_members TO authenticated;
GRANT ALL ON public.team_members TO service_role;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members see their own team assignment" ON public.team_members
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'sysadmin'));
CREATE POLICY "Admins and team leads manage members" ON public.team_members
  FOR ALL TO authenticated
  USING (
    public.has_role(auth.uid(), 'sysadmin')
    OR EXISTS (SELECT 1 FROM public.teams t WHERE t.id = team_id AND t.team_lead_id = auth.uid())
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'sysadmin')
    OR EXISTS (SELECT 1 FROM public.teams t WHERE t.id = team_id AND t.team_lead_id = auth.uid())
  );

-- Trigger: friendlier error when a user is being assigned to a second active team.
CREATE OR REPLACE FUNCTION public.enforce_single_active_team()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  existing_team_name TEXT;
  existing_lead_name TEXT;
BEGIN
  IF NEW.is_active THEN
    SELECT t.name, COALESCE(p.full_name, 'Unknown')
      INTO existing_team_name, existing_lead_name
    FROM public.team_members tm
    JOIN public.teams t ON t.id = tm.team_id
    LEFT JOIN public.profiles p ON p.id = t.team_lead_id
    WHERE tm.user_id = NEW.user_id
      AND tm.is_active = true
      AND tm.id <> COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
    LIMIT 1;

    IF existing_team_name IS NOT NULL THEN
      RAISE EXCEPTION USING
        MESSAGE = 'This employee is currently assigned to Team ''' || existing_team_name ||
                  ''' under Team Lead ''' || existing_lead_name ||
                  '''. Please remove the employee from the current team before assigning them to another.',
        ERRCODE = 'P0001';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER team_members_single_active
  BEFORE INSERT OR UPDATE ON public.team_members
  FOR EACH ROW EXECUTE FUNCTION public.enforce_single_active_team();

-- ---------- USER SESSIONS ----------
CREATE TABLE public.user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device TEXT,
  browser TEXT,
  ip_address TEXT,
  network_classification TEXT NOT NULL DEFAULT 'external', -- 'internal' | 'external'
  mfa_verified BOOLEAN NOT NULL DEFAULT false,
  login_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_activity_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.user_sessions TO authenticated;
GRANT ALL ON public.user_sessions TO service_role;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see their own sessions" ON public.user_sessions
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'sysadmin'));
CREATE POLICY "Users insert their own sessions" ON public.user_sessions
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users update their own sessions" ON public.user_sessions
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ---------- AUDIT EVENTS (append-only, immutable) ----------
CREATE TABLE public.audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT,
  role TEXT,
  session_id UUID,
  event_type TEXT NOT NULL,  -- login_success | login_failed | logout | session_timeout | mfa_verified | mfa_failed | auth_failure | unauthorized_access
  outcome TEXT NOT NULL,     -- success | failure
  action TEXT,
  device TEXT,
  browser TEXT,
  ip_address TEXT,
  network_classification TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.audit_events TO authenticated;
GRANT ALL ON public.audit_events TO service_role;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see their own audit events" ON public.audit_events
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'sysadmin'));
CREATE POLICY "Signed-in users can insert audit events" ON public.audit_events
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- Enforce immutability: block UPDATE and DELETE for everyone (service_role bypasses RLS but this
-- trigger fires regardless — the trigger below excludes only session_replication_role = 'replica').
CREATE OR REPLACE FUNCTION public.block_audit_mutation()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'audit_events is append-only; % is not permitted', TG_OP
    USING ERRCODE = 'P0001';
END;
$$;
CREATE TRIGGER audit_events_no_update
  BEFORE UPDATE ON public.audit_events
  FOR EACH ROW EXECUTE FUNCTION public.block_audit_mutation();
CREATE TRIGGER audit_events_no_delete
  BEFORE DELETE ON public.audit_events
  FOR EACH ROW EXECUTE FUNCTION public.block_audit_mutation();

-- ---------- HARD TOKENS ----------
CREATE TABLE public.hard_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  serial_number TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.hard_tokens TO authenticated;
GRANT ALL ON public.hard_tokens TO service_role;
ALTER TABLE public.hard_tokens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see their own token" ON public.hard_tokens
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'sysadmin'));
CREATE POLICY "Admins manage hard tokens" ON public.hard_tokens
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'sysadmin'))
  WITH CHECK (public.has_role(auth.uid(), 'sysadmin'));

-- ---------- TRUSTED NETWORKS ----------
CREATE TABLE public.trusted_networks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  cidr TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.trusted_networks TO authenticated;
GRANT ALL ON public.trusted_networks TO service_role;
ALTER TABLE public.trusted_networks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone signed in can view trusted networks" ON public.trusted_networks
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage trusted networks" ON public.trusted_networks
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'sysadmin'))
  WITH CHECK (public.has_role(auth.uid(), 'sysadmin'));

-- ---------- updated_at triggers ----------
CREATE TRIGGER trg_departments_updated BEFORE UPDATE ON public.departments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_sub_departments_updated BEFORE UPDATE ON public.sub_departments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_teams_updated BEFORE UPDATE ON public.teams
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_team_members_updated BEFORE UPDATE ON public.team_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_user_sessions_updated BEFORE UPDATE ON public.user_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_hard_tokens_updated BEFORE UPDATE ON public.hard_tokens
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_trusted_networks_updated BEFORE UPDATE ON public.trusted_networks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------- SEED: departments and sub-departments ----------
INSERT INTO public.departments (name) VALUES
  ('Inbound'),
  ('Fraud Help Desk'),
  ('Containment'),
  ('CFC Operation Support'),
  ('Quality Assurance'),
  ('Service Recovery'),
  ('Resolution'),
  ('CFC Virtual Banking Dispute Team'),
  ('BPI'),
  ('Learning & Development');

INSERT INTO public.sub_departments (department_id, name)
SELECT d.id, s.name FROM public.departments d
JOIN (VALUES
  ('Inbound','Premium Help Desk'),
  ('Inbound','Multimedia'),
  ('Inbound','Email'),
  ('Inbound','Live Chat'),
  ('Inbound','Social Media'),
  ('Inbound','Video Validation'),
  ('Fraud Help Desk','Fraud Help Desk'),
  ('Containment','Block Card')
) AS s(dept, name) ON s.dept = d.name;
