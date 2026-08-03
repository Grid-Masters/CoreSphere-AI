-- ============================================================
-- Batch 2 — Identity, Organisation and Capability model
-- Additive only. No existing table or enum value is removed.
-- ============================================================

CREATE TYPE public.org_unit_type AS ENUM (
  'GROUP','EXECUTIVE_PORTFOLIO','DEPARTMENT','LINE_OF_BUSINESS','UNIT','TEAM','DESK'
);

CREATE TYPE public.capability_scope_type AS ENUM (
  'SELF','TEAM','DEPARTMENT','ENTERPRISE','ASSIGNED_STAFF','PLATFORM'
);

-- ---------- profiles extension ----------
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS employee_number    TEXT,
  ADD COLUMN IF NOT EXISTS corporate_email    TEXT,
  ADD COLUMN IF NOT EXISTS full_name          TEXT,
  ADD COLUMN IF NOT EXISTS preferred_name     TEXT,
  ADD COLUMN IF NOT EXISTS employment_status  TEXT NOT NULL DEFAULT 'ACTIVE',
  ADD COLUMN IF NOT EXISTS country_code       TEXT NOT NULL DEFAULT 'NG',
  ADD COLUMN IF NOT EXISTS primary_org_unit_id UUID,
  ADD COLUMN IF NOT EXISTS profile_status     TEXT NOT NULL DEFAULT 'ACTIVE',
  ADD COLUMN IF NOT EXISTS start_date         DATE NOT NULL DEFAULT CURRENT_DATE,
  ADD COLUMN IF NOT EXISTS end_date           DATE,
  ADD COLUMN IF NOT EXISTS is_demo            BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_employment_status_check
    CHECK (employment_status IN ('ACTIVE','SUSPENDED','TERMINATED','ON_LEAVE')),
  ADD CONSTRAINT profiles_profile_status_check
    CHECK (profile_status IN ('ACTIVE','INACTIVE','PENDING'));

CREATE UNIQUE INDEX IF NOT EXISTS profiles_employee_number_key
  ON public.profiles (employee_number) WHERE employee_number IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS profiles_corporate_email_key
  ON public.profiles (lower(corporate_email)) WHERE corporate_email IS NOT NULL;

UPDATE public.profiles SET full_name = COALESCE(full_name, display_name);

-- ---------- organisation_units ----------
CREATE TABLE public.organisation_units (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code           TEXT NOT NULL UNIQUE,
  name           TEXT NOT NULL,
  display_name   TEXT NOT NULL,
  unit_type      public.org_unit_type NOT NULL,
  parent_unit_id UUID REFERENCES public.organisation_units(id) ON DELETE RESTRICT,
  country_code   TEXT,
  is_active      BOOLEAN NOT NULL DEFAULT true,
  effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
  effective_to   DATE,
  metadata       JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.organisation_units TO authenticated;
GRANT ALL ON public.organisation_units TO service_role;
ALTER TABLE public.organisation_units ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org units readable by authenticated" ON public.organisation_units
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "platform admin manages org units" ON public.organisation_units
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'sysadmin'))
  WITH CHECK (public.has_role(auth.uid(), 'sysadmin'));
CREATE TRIGGER trg_org_units_updated BEFORE UPDATE ON public.organisation_units
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_primary_org_unit_fkey
  FOREIGN KEY (primary_org_unit_id) REFERENCES public.organisation_units(id) ON DELETE SET NULL;

-- ---------- positions ----------
CREATE TABLE public.positions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code            TEXT NOT NULL UNIQUE,
  title           TEXT NOT NULL,
  position_family TEXT NOT NULL,
  description     TEXT,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.positions TO authenticated;
GRANT ALL ON public.positions TO service_role;
ALTER TABLE public.positions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "positions readable by authenticated" ON public.positions
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "platform admin manages positions" ON public.positions
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'sysadmin'))
  WITH CHECK (public.has_role(auth.uid(), 'sysadmin'));
CREATE TRIGGER trg_positions_updated BEFORE UPDATE ON public.positions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------- capabilities ----------
CREATE TABLE public.capabilities (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code        TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  description TEXT,
  domain      TEXT NOT NULL,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.capabilities TO authenticated;
GRANT ALL ON public.capabilities TO service_role;
ALTER TABLE public.capabilities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "capabilities readable by authenticated" ON public.capabilities
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "platform admin manages capabilities" ON public.capabilities
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'sysadmin'))
  WITH CHECK (public.has_role(auth.uid(), 'sysadmin'));

-- ---------- position_capabilities ----------
CREATE TABLE public.position_capabilities (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  position_id        UUID NOT NULL REFERENCES public.positions(id) ON DELETE CASCADE,
  capability_id      UUID NOT NULL REFERENCES public.capabilities(id) ON DELETE CASCADE,
  default_scope_type public.capability_scope_type NOT NULL DEFAULT 'SELF',
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (position_id, capability_id)
);
GRANT SELECT ON public.position_capabilities TO authenticated;
GRANT ALL ON public.position_capabilities TO service_role;
ALTER TABLE public.position_capabilities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "position capabilities readable by authenticated" ON public.position_capabilities
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "platform admin manages position capabilities" ON public.position_capabilities
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'sysadmin'))
  WITH CHECK (public.has_role(auth.uid(), 'sysadmin'));

-- ---------- position_assignments ----------
CREATE TABLE public.position_assignments (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                   UUID NOT NULL,
  position_id               UUID NOT NULL REFERENCES public.positions(id) ON DELETE RESTRICT,
  organisation_unit_id      UUID NOT NULL REFERENCES public.organisation_units(id) ON DELETE RESTRICT,
  reports_to_assignment_id  UUID REFERENCES public.position_assignments(id) ON DELETE SET NULL,
  effective_from            DATE NOT NULL DEFAULT CURRENT_DATE,
  effective_to              DATE,
  is_primary                BOOLEAN NOT NULL DEFAULT true,
  status                    TEXT NOT NULL DEFAULT 'ACTIVE',
  created_at                TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT position_assignments_status_check
    CHECK (status IN ('ACTIVE','PENDING','ENDED','REVOKED')),
  CONSTRAINT position_assignments_period_check
    CHECK (effective_to IS NULL OR effective_to >= effective_from)
);
CREATE INDEX position_assignments_user_idx ON public.position_assignments (user_id);
GRANT SELECT ON public.position_assignments TO authenticated;
GRANT ALL ON public.position_assignments TO service_role;
ALTER TABLE public.position_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own assignments" ON public.position_assignments
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "platform admin manages assignments" ON public.position_assignments
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'sysadmin'))
  WITH CHECK (public.has_role(auth.uid(), 'sysadmin'));
CREATE TRIGGER trg_position_assignments_updated BEFORE UPDATE ON public.position_assignments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- One simultaneously active PRIMARY assignment per user for overlapping periods.
CREATE OR REPLACE FUNCTION public.enforce_single_primary_assignment()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  clash_id UUID;
BEGIN
  IF NEW.is_primary AND NEW.status = 'ACTIVE' THEN
    SELECT pa.id INTO clash_id
    FROM public.position_assignments pa
    WHERE pa.user_id = NEW.user_id
      AND pa.is_primary
      AND pa.status = 'ACTIVE'
      AND pa.id <> COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
      AND daterange(pa.effective_from, pa.effective_to, '[]')
          && daterange(NEW.effective_from, NEW.effective_to, '[]')
    LIMIT 1;

    IF clash_id IS NOT NULL THEN
      RAISE EXCEPTION 'This employee already has an active primary position assignment covering that period. End the current assignment first, or record a delegation instead.'
        USING ERRCODE = 'P0001';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER position_assignments_single_primary
  BEFORE INSERT OR UPDATE ON public.position_assignments
  FOR EACH ROW EXECUTE FUNCTION public.enforce_single_primary_assignment();

-- ---------- user_capability_grants ----------
CREATE TABLE public.user_capability_grants (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID NOT NULL,
  capability_id      UUID NOT NULL REFERENCES public.capabilities(id) ON DELETE CASCADE,
  scope_type         public.capability_scope_type NOT NULL DEFAULT 'SELF',
  scope_id           UUID,
  granted_by_user_id UUID,
  reason             TEXT,
  effective_from     DATE NOT NULL DEFAULT CURRENT_DATE,
  effective_to       DATE,
  status             TEXT NOT NULL DEFAULT 'ACTIVE',
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT user_capability_grants_status_check
    CHECK (status IN ('ACTIVE','REVOKED','EXPIRED'))
);
CREATE INDEX user_capability_grants_user_idx ON public.user_capability_grants (user_id);
GRANT SELECT ON public.user_capability_grants TO authenticated;
GRANT ALL ON public.user_capability_grants TO service_role;
ALTER TABLE public.user_capability_grants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own capability grants" ON public.user_capability_grants
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "platform admin manages capability grants" ON public.user_capability_grants
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'sysadmin'))
  WITH CHECK (public.has_role(auth.uid(), 'sysadmin'));

-- ---------- delegations ----------
CREATE TABLE public.delegations (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  delegator_user_id    UUID NOT NULL,
  delegate_user_id     UUID NOT NULL,
  capability_id        UUID REFERENCES public.capabilities(id) ON DELETE CASCADE,
  delegated_position_id UUID REFERENCES public.positions(id) ON DELETE CASCADE,
  scope_type           public.capability_scope_type NOT NULL DEFAULT 'SELF',
  scope_id             UUID,
  reason               TEXT,
  effective_from       DATE NOT NULL DEFAULT CURRENT_DATE,
  effective_to         DATE NOT NULL,
  status               TEXT NOT NULL DEFAULT 'PENDING',
  accepted_at          TIMESTAMPTZ,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT delegations_status_check
    CHECK (status IN ('PENDING','ACTIVE','DECLINED','REVOKED','EXPIRED')),
  CONSTRAINT delegations_target_check
    CHECK (capability_id IS NOT NULL OR delegated_position_id IS NOT NULL),
  CONSTRAINT delegations_period_check CHECK (effective_to >= effective_from)
);
CREATE INDEX delegations_delegate_idx ON public.delegations (delegate_user_id);
GRANT SELECT ON public.delegations TO authenticated;
GRANT ALL ON public.delegations TO service_role;
ALTER TABLE public.delegations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "parties read own delegations" ON public.delegations
  FOR SELECT TO authenticated
  USING (auth.uid() = delegator_user_id OR auth.uid() = delegate_user_id);
CREATE POLICY "platform admin manages delegations" ON public.delegations
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'sysadmin'))
  WITH CHECK (public.has_role(auth.uid(), 'sysadmin'));

-- ---------- capability resolution helper ----------
CREATE OR REPLACE FUNCTION public.has_capability(_user_id UUID, _code TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.position_assignments pa
    JOIN public.position_capabilities pc ON pc.position_id = pa.position_id
    JOIN public.capabilities c ON c.id = pc.capability_id
    WHERE pa.user_id = _user_id
      AND pa.status = 'ACTIVE'
      AND pa.effective_from <= CURRENT_DATE
      AND (pa.effective_to IS NULL OR pa.effective_to >= CURRENT_DATE)
      AND c.code = _code AND c.is_active
    UNION ALL
    SELECT 1
    FROM public.user_capability_grants g
    JOIN public.capabilities c ON c.id = g.capability_id
    WHERE g.user_id = _user_id
      AND g.status = 'ACTIVE'
      AND g.effective_from <= CURRENT_DATE
      AND (g.effective_to IS NULL OR g.effective_to >= CURRENT_DATE)
      AND c.code = _code AND c.is_active
    UNION ALL
    SELECT 1
    FROM public.delegations d
    JOIN public.capabilities c ON c.id = d.capability_id
    WHERE d.delegate_user_id = _user_id
      AND d.status = 'ACTIVE'
      AND d.effective_from <= CURRENT_DATE
      AND d.effective_to >= CURRENT_DATE
      AND c.code = _code AND c.is_active
  );
$$;

-- ============================================================
-- SEED: organisation structure
-- ============================================================
INSERT INTO public.organisation_units (code, name, display_name, unit_type, parent_unit_id, country_code)
VALUES ('CFC-GROUP','Customer Fulfilment Group','Customer Fulfilment Group','GROUP',NULL,'NG');

WITH g AS (SELECT id FROM public.organisation_units WHERE code = 'CFC-GROUP')
INSERT INTO public.organisation_units (code, name, display_name, unit_type, parent_unit_id, country_code)
SELECT v.code, v.name, v.name, v.unit_type::public.org_unit_type, g.id, 'NG'
FROM g, (VALUES
  ('CFC-GROUP-HEAD-OFFICE','Office of the Group Head','EXECUTIVE_PORTFOLIO'),
  ('CFC-OPERATIONS','CFC Operations','DEPARTMENT'),
  ('CFC-DSR-PORTFOLIO','Dispute Resolution & Service Recovery Portfolio','EXECUTIVE_PORTFOLIO'),
  ('CFC-ALT-CHANNEL-SALES-PORTFOLIO','Alternative Channel Sales Portfolio','EXECUTIVE_PORTFOLIO'),
  ('CFC-INBOUND','Inbound','DEPARTMENT'),
  ('CFC-SERVICE-RECOVERY','Service Recovery','DEPARTMENT'),
  ('CFC-QA','Quality Assurance','DEPARTMENT'),
  ('CFC-LD','Learning & Development','DEPARTMENT'),
  ('CFC-VIDEO-VALIDATION','Video Validation','DEPARTMENT'),
  ('CFC-BPI','BPI','DEPARTMENT'),
  ('CFC-SOCIAL-MEDIA','Social Media','DEPARTMENT'),
  ('CFC-MULTIMEDIA','Multimedia','DEPARTMENT'),
  ('CFC-RESOLUTION','Resolution','DEPARTMENT'),
  ('CFC-OPERATIONS-SUPPORT','Operations Support','DEPARTMENT'),
  ('CFC-VIRTUAL-BANKING-DISPUTE','Virtual Banking Dispute Team','TEAM'),
  ('CFC-FRAUD-HELP-DESK','Fraud Help Desk','DEPARTMENT'),
  ('CFC-ALTERNATIVE-CHANNELS','Alternative Channels','LINE_OF_BUSINESS')
) AS v(code, name, unit_type);

WITH m AS (SELECT id FROM public.organisation_units WHERE code = 'CFC-MULTIMEDIA')
INSERT INTO public.organisation_units (code, name, display_name, unit_type, parent_unit_id, country_code)
SELECT v.code, v.name, v.name, 'UNIT'::public.org_unit_type, m.id, 'NG'
FROM m, (VALUES
  ('CFC-MULTIMEDIA-EMAIL','Email'),
  ('CFC-MULTIMEDIA-LIVE-CHAT','Live Chat')
) AS v(code, name);

WITH f AS (SELECT id FROM public.organisation_units WHERE code = 'CFC-FRAUD-HELP-DESK')
INSERT INTO public.organisation_units (code, name, display_name, unit_type, parent_unit_id, country_code)
SELECT v.code, v.name, v.name, 'UNIT'::public.org_unit_type, f.id, 'NG'
FROM f, (VALUES
  ('CFC-FHD-OPERATIONS','FHD Operations / Fraud Help Desk'),
  ('CFC-INCIDENT-CONTAINMENT','Incident Containment'),
  ('CFC-BLOCK-CARD','Block Card')
) AS v(code, name);

-- ============================================================
-- SEED: positions
-- ============================================================
INSERT INTO public.positions (code, title, position_family, description) VALUES
  ('CEE','Customer Experience Executive','OPERATIONS','Front-line customer fulfilment officer.'),
  ('TEAM_LEAD','Team Lead','OPERATIONS','Leads an operational team.'),
  ('UNIT_HEAD','Unit Head','OPERATIONS','Heads an operational department or unit.'),
  ('QA_OFFICER','QA Officer','QA','Audits and coaches assigned staff for the active QA period.'),
  ('QA_TEAM_LEAD','QA Team Lead','QA','Manages QA Officer assignments and reviews QA work.'),
  ('QA_UNIT_HEAD','QA Unit Head','QA','Owns QA governance, scorecard standards and cross-team trends.'),
  ('LD_OFFICER','L&D Officer','LD','Registers sources, drafts knowledge and creates assessments.'),
  ('LD_TEAM_LEAD','L&D Team Lead','LD','Reviews source, knowledge and assessment work.'),
  ('LD_UNIT_HEAD','L&D Unit Head','LD','Approves and publishes knowledge and assessments.'),
  ('HEAD_CFC_OPERATIONS','Head of CFC Operations','EXECUTIVE','Enterprise operational oversight.'),
  ('GROUP_HEAD','Group Head','EXECUTIVE','Enterprise oversight of the Customer Fulfilment Group.'),
  ('PLATFORM_ADMINISTRATOR','Platform Administrator','PLATFORM','Technical platform authority only.'),
  ('DELEGATED_APPROVER','Temporary or Delegated Approver','GOVERNANCE','No standing authority; acts only through an active delegation.');

-- ============================================================
-- SEED: capability catalogue
-- ============================================================
INSERT INTO public.capabilities (code, name, domain) VALUES
  ('platform.identity.manage','Manage identity records','PLATFORM'),
  ('platform.organisation.manage','Manage organisation structure','PLATFORM'),
  ('platform.security.manage','Manage platform security','PLATFORM'),
  ('platform.configuration.manage','Manage platform configuration','PLATFORM'),
  ('platform.audit.view','View audit events','PLATFORM'),
  ('knowledge.source.register','Register a source document','KNOWLEDGE'),
  ('knowledge.source.review','Review a registered source','KNOWLEDGE'),
  ('knowledge.source.approve','Approve a source','KNOWLEDGE'),
  ('knowledge.record.create','Create a canonical knowledge record','KNOWLEDGE'),
  ('knowledge.record.review','Review a canonical knowledge record','KNOWLEDGE'),
  ('knowledge.record.approve','Approve a canonical knowledge record','KNOWLEDGE'),
  ('knowledge.record.publish','Publish a canonical knowledge record','KNOWLEDGE'),
  ('knowledge.conflict.register','Register a knowledge conflict','KNOWLEDGE'),
  ('knowledge.conflict.review','Review a knowledge conflict','KNOWLEDGE'),
  ('knowledge.conflict.decide','Decide a knowledge conflict','KNOWLEDGE'),
  ('knowledge.conflict.view','View the knowledge conflict queue','KNOWLEDGE'),
  ('mission.assign.qa_staff','Assign missions to assigned QA staff','MISSION'),
  ('mission.assign.team','Assign missions within own team','MISSION'),
  ('mission.assign.department','Assign missions within own department','MISSION'),
  ('mission.assign.enterprise','Assign missions enterprise-wide','MISSION'),
  ('mission.rule.manage','Manage AI mission assignment rules','MISSION'),
  ('assessment.create','Create an assessment','ASSESSMENT'),
  ('assessment.ai_generate','Generate an AI assessment draft','ASSESSMENT'),
  ('assessment.review','Review an assessment','ASSESSMENT'),
  ('assessment.approve','Approve an assessment','ASSESSMENT'),
  ('assessment.publish','Publish an assessment','ASSESSMENT'),
  ('assessment.results.view_own','View own assessment results','ASSESSMENT'),
  ('assessment.results.view_team','View team assessment results','ASSESSMENT'),
  ('assessment.results.view_department','View department assessment results','ASSESSMENT'),
  ('assessment.results.view_enterprise','View enterprise assessment results','ASSESSMENT'),
  ('assessment.results.view_item_analysis','View assessment item analysis','ASSESSMENT'),
  ('qa.audit','Perform QA audits','QA'),
  ('qa.coach.assigned_staff','Coach assigned staff','QA'),
  ('qa.assignment.manage','Manage QA officer assignments','QA'),
  ('qa.scorecard.approve','Approve QA scorecards','QA'),
  ('qa.governance.manage','Manage QA governance','QA');

-- ============================================================
-- SEED: conservative position → capability baseline
-- ============================================================
INSERT INTO public.position_capabilities (position_id, capability_id, default_scope_type)
SELECT p.id, c.id, v.scope::public.capability_scope_type
FROM (VALUES
  ('CEE','assessment.results.view_own','SELF'),

  ('TEAM_LEAD','assessment.results.view_own','SELF'),
  ('TEAM_LEAD','assessment.results.view_team','TEAM'),
  ('TEAM_LEAD','mission.assign.team','TEAM'),

  ('UNIT_HEAD','assessment.results.view_own','SELF'),
  ('UNIT_HEAD','assessment.results.view_team','TEAM'),
  ('UNIT_HEAD','assessment.results.view_department','DEPARTMENT'),
  ('UNIT_HEAD','mission.assign.team','TEAM'),
  ('UNIT_HEAD','mission.assign.department','DEPARTMENT'),

  ('QA_OFFICER','qa.audit','ASSIGNED_STAFF'),
  ('QA_OFFICER','qa.coach.assigned_staff','ASSIGNED_STAFF'),
  ('QA_OFFICER','mission.assign.qa_staff','ASSIGNED_STAFF'),
  ('QA_OFFICER','assessment.results.view_own','SELF'),

  ('QA_TEAM_LEAD','qa.audit','TEAM'),
  ('QA_TEAM_LEAD','qa.assignment.manage','TEAM'),
  ('QA_TEAM_LEAD','assessment.results.view_own','SELF'),

  ('QA_UNIT_HEAD','qa.assignment.manage','DEPARTMENT'),
  ('QA_UNIT_HEAD','qa.scorecard.approve','DEPARTMENT'),
  ('QA_UNIT_HEAD','qa.governance.manage','DEPARTMENT'),
  ('QA_UNIT_HEAD','assessment.results.view_own','SELF'),

  ('LD_OFFICER','knowledge.source.register','DEPARTMENT'),
  ('LD_OFFICER','knowledge.record.create','DEPARTMENT'),
  ('LD_OFFICER','knowledge.conflict.register','DEPARTMENT'),
  ('LD_OFFICER','knowledge.conflict.view','DEPARTMENT'),
  ('LD_OFFICER','assessment.create','DEPARTMENT'),
  ('LD_OFFICER','assessment.ai_generate','DEPARTMENT'),
  ('LD_OFFICER','mission.assign.department','DEPARTMENT'),
  ('LD_OFFICER','assessment.results.view_own','SELF'),

  ('LD_TEAM_LEAD','knowledge.source.register','DEPARTMENT'),
  ('LD_TEAM_LEAD','knowledge.source.review','DEPARTMENT'),
  ('LD_TEAM_LEAD','knowledge.record.create','DEPARTMENT'),
  ('LD_TEAM_LEAD','knowledge.record.review','DEPARTMENT'),
  ('LD_TEAM_LEAD','knowledge.conflict.register','DEPARTMENT'),
  ('LD_TEAM_LEAD','knowledge.conflict.review','DEPARTMENT'),
  ('LD_TEAM_LEAD','knowledge.conflict.view','DEPARTMENT'),
  ('LD_TEAM_LEAD','assessment.create','DEPARTMENT'),
  ('LD_TEAM_LEAD','assessment.review','DEPARTMENT'),
  ('LD_TEAM_LEAD','mission.assign.department','DEPARTMENT'),
  ('LD_TEAM_LEAD','assessment.results.view_own','SELF'),
  ('LD_TEAM_LEAD','assessment.results.view_department','DEPARTMENT'),

  ('LD_UNIT_HEAD','knowledge.source.review','ENTERPRISE'),
  ('LD_UNIT_HEAD','knowledge.source.approve','ENTERPRISE'),
  ('LD_UNIT_HEAD','knowledge.record.review','ENTERPRISE'),
  ('LD_UNIT_HEAD','knowledge.record.approve','ENTERPRISE'),
  ('LD_UNIT_HEAD','knowledge.record.publish','ENTERPRISE'),
  ('LD_UNIT_HEAD','knowledge.conflict.review','ENTERPRISE'),
  ('LD_UNIT_HEAD','knowledge.conflict.decide','ENTERPRISE'),
  ('LD_UNIT_HEAD','knowledge.conflict.view','ENTERPRISE'),
  ('LD_UNIT_HEAD','assessment.review','ENTERPRISE'),
  ('LD_UNIT_HEAD','assessment.approve','ENTERPRISE'),
  ('LD_UNIT_HEAD','assessment.publish','ENTERPRISE'),
  ('LD_UNIT_HEAD','mission.assign.enterprise','ENTERPRISE'),
  ('LD_UNIT_HEAD','mission.rule.manage','ENTERPRISE'),
  ('LD_UNIT_HEAD','assessment.results.view_own','SELF'),
  ('LD_UNIT_HEAD','assessment.results.view_enterprise','ENTERPRISE'),
  ('LD_UNIT_HEAD','assessment.results.view_item_analysis','ENTERPRISE'),

  ('HEAD_CFC_OPERATIONS','knowledge.conflict.view','ENTERPRISE'),
  ('HEAD_CFC_OPERATIONS','knowledge.conflict.decide','ENTERPRISE'),
  ('HEAD_CFC_OPERATIONS','assessment.results.view_own','SELF'),
  ('HEAD_CFC_OPERATIONS','assessment.results.view_enterprise','ENTERPRISE'),
  ('HEAD_CFC_OPERATIONS','mission.assign.enterprise','ENTERPRISE'),

  ('GROUP_HEAD','knowledge.conflict.view','ENTERPRISE'),
  ('GROUP_HEAD','assessment.results.view_own','SELF'),
  ('GROUP_HEAD','assessment.results.view_enterprise','ENTERPRISE'),

  ('PLATFORM_ADMINISTRATOR','platform.identity.manage','PLATFORM'),
  ('PLATFORM_ADMINISTRATOR','platform.organisation.manage','PLATFORM'),
  ('PLATFORM_ADMINISTRATOR','platform.security.manage','PLATFORM'),
  ('PLATFORM_ADMINISTRATOR','platform.configuration.manage','PLATFORM'),
  ('PLATFORM_ADMINISTRATOR','platform.audit.view','PLATFORM'),
  ('PLATFORM_ADMINISTRATOR','assessment.results.view_own','SELF')
) AS v(position_code, capability_code, scope)
JOIN public.positions p ON p.code = v.position_code
JOIN public.capabilities c ON c.code = v.capability_code;

-- ============================================================
-- SEED: demo profiles (DEVELOPMENT / DEMO DATA ONLY)
-- ============================================================
WITH demo(user_id, employee_number, email, full_name, preferred_name, unit_code) AS (VALUES
  ('f6c1320b-0f86-4355-923c-e8e3a912dba5'::uuid,'CFC-0001','a.okafor@ubagroup.com','Adaeze Okafor','Adaeze','CFC-FHD-OPERATIONS'),
  ('7da70299-2056-4097-8404-e0c7ffd02dd3','CFC-0002','m.bello@ubagroup.com','Musa Bello','Musa','CFC-INBOUND'),
  ('b5e5c9fd-67ef-4a22-b809-a8a245042aa7','CFC-0003','e.james@ubagroup.com','Esther James','Esther','CFC-MULTIMEDIA-LIVE-CHAT'),
  ('7fbd1b0f-1ff0-480b-9e2c-3ab2b0304ab6','CFC-0004','t.aina@ubagroup.com','Tunde Aina','Tunde','CFC-SOCIAL-MEDIA'),
  ('4162ba13-0324-47bf-92e3-8aaec8aca50c','CFC-0005','d.obi@ubagroup.com','Daniel Obi','Daniel','CFC-QA'),
  ('6b90b3ff-ae62-414b-ae64-4e5fedabbbd7','CFC-0006','r.adeyemi@ubagroup.com','Rita Adeyemi','Rita','CFC-QA'),
  ('089b0529-263d-40b1-8951-f195211614d1','CFC-0007','c.paul@ubagroup.com','Chioma Paul','Chioma','CFC-LD'),
  ('0783db76-df4a-4824-8355-7affdbcebcba','CFC-0008','s.eze@ubagroup.com','Sani Eze','Sani','CFC-FHD-OPERATIONS'),
  ('33ff2e2b-c1fd-413f-9e33-5b9c870c0a34','CFC-0009','a.yusuf@ubagroup.com','Aliyu Yusuf','Aliyu','CFC-GROUP-HEAD-OFFICE'),
  ('f5c61b62-9aee-4911-baa7-347169053967','CFC-0010','admin@ubagroup.com','Ibrahim Sadiq','Ibrahim','CFC-OPERATIONS-SUPPORT'),
  ('ff173534-09f9-4dfe-8e10-4f61f3f2a590','CFC-0011','k.nwosu@ubagroup.com','Kelechi Nwosu','Kelechi','CFC-INCIDENT-CONTAINMENT'),
  ('6603349c-036f-4642-8959-15820f90a59c','CFC-0012','b.lawal@ubagroup.com','Bisi Lawal','Bisi','CFC-BLOCK-CARD'),
  ('ad45f8c3-4c1e-4086-98b7-806aa3219103','CFC-0013','f.adeleke@ubagroup.com','Folake Adeleke','Folake','CFC-MULTIMEDIA-EMAIL'),
  ('4b3325b5-12f5-48cb-82c9-0bf466800450','CFC-0014','h.danjuma@ubagroup.com','Hauwa Danjuma','Hauwa','CFC-VIRTUAL-BANKING-DISPUTE'),
  ('f2f19732-d516-47fd-abe3-376ab99722ec','CFC-0015','o.balogun@ubagroup.com','Olu Balogun','Olu','CFC-QA'),
  ('ba892106-3d29-4be3-afd0-c0fc9e88e3b9','CFC-0016','g.iheanacho@ubagroup.com','Grace Iheanacho','Grace','CFC-QA'),
  ('500a4ae4-d235-413a-b1c0-a28e8dd7707f','CFC-0017','n.abubakar@ubagroup.com','Nafisa Abubakar','Nafisa','CFC-FRAUD-HELP-DESK'),
  ('60cb3b58-756e-4c3b-9a2b-ab7093b6447a','CFC-0018','p.okonkwo@ubagroup.com','Peter Okonkwo','Peter','CFC-LD'),
  ('6de07f2a-4d72-4f98-915f-f193a7f04878','CFC-0019','v.ekpo@ubagroup.com','Victoria Ekpo','Victoria','CFC-LD'),
  ('ca0d3571-1a8f-49a2-a1bd-5858563325d7','CFC-0020','s.mohammed@ubagroup.com','Sadiq Mohammed','Sadiq','CFC-OPERATIONS')
)
INSERT INTO public.profiles (
  user_id, display_name, full_name, preferred_name, employee_number, corporate_email,
  employment_status, profile_status, country_code, primary_org_unit_id, is_demo
)
SELECT d.user_id, d.full_name, d.full_name, d.preferred_name, d.employee_number, d.email,
       'ACTIVE','ACTIVE','NG', ou.id, true
FROM demo d
JOIN public.organisation_units ou ON ou.code = d.unit_code
ON CONFLICT (user_id) DO UPDATE SET
  full_name           = EXCLUDED.full_name,
  preferred_name      = EXCLUDED.preferred_name,
  employee_number     = EXCLUDED.employee_number,
  corporate_email     = EXCLUDED.corporate_email,
  employment_status   = 'ACTIVE',
  profile_status      = 'ACTIVE',
  country_code        = 'NG',
  primary_org_unit_id = EXCLUDED.primary_org_unit_id,
  is_demo             = true;

-- ============================================================
-- SEED: demo primary position assignments
-- ============================================================
WITH demo(user_id, position_code, unit_code) AS (VALUES
  ('f6c1320b-0f86-4355-923c-e8e3a912dba5'::uuid,'CEE','CFC-FHD-OPERATIONS'),
  ('7da70299-2056-4097-8404-e0c7ffd02dd3','CEE','CFC-INBOUND'),
  ('b5e5c9fd-67ef-4a22-b809-a8a245042aa7','CEE','CFC-MULTIMEDIA-LIVE-CHAT'),
  ('7fbd1b0f-1ff0-480b-9e2c-3ab2b0304ab6','CEE','CFC-SOCIAL-MEDIA'),
  ('4162ba13-0324-47bf-92e3-8aaec8aca50c','QA_OFFICER','CFC-QA'),
  ('6b90b3ff-ae62-414b-ae64-4e5fedabbbd7','QA_OFFICER','CFC-QA'),
  ('089b0529-263d-40b1-8951-f195211614d1','LD_OFFICER','CFC-LD'),
  ('0783db76-df4a-4824-8355-7affdbcebcba','TEAM_LEAD','CFC-FHD-OPERATIONS'),
  ('33ff2e2b-c1fd-413f-9e33-5b9c870c0a34','GROUP_HEAD','CFC-GROUP-HEAD-OFFICE'),
  ('f5c61b62-9aee-4911-baa7-347169053967','PLATFORM_ADMINISTRATOR','CFC-OPERATIONS-SUPPORT'),
  ('ff173534-09f9-4dfe-8e10-4f61f3f2a590','CEE','CFC-INCIDENT-CONTAINMENT'),
  ('6603349c-036f-4642-8959-15820f90a59c','CEE','CFC-BLOCK-CARD'),
  ('ad45f8c3-4c1e-4086-98b7-806aa3219103','CEE','CFC-MULTIMEDIA-EMAIL'),
  ('4b3325b5-12f5-48cb-82c9-0bf466800450','CEE','CFC-VIRTUAL-BANKING-DISPUTE'),
  ('f2f19732-d516-47fd-abe3-376ab99722ec','QA_TEAM_LEAD','CFC-QA'),
  ('ba892106-3d29-4be3-afd0-c0fc9e88e3b9','QA_UNIT_HEAD','CFC-QA'),
  ('500a4ae4-d235-413a-b1c0-a28e8dd7707f','UNIT_HEAD','CFC-FRAUD-HELP-DESK'),
  ('60cb3b58-756e-4c3b-9a2b-ab7093b6447a','LD_TEAM_LEAD','CFC-LD'),
  ('6de07f2a-4d72-4f98-915f-f193a7f04878','LD_UNIT_HEAD','CFC-LD'),
  ('ca0d3571-1a8f-49a2-a1bd-5858563325d7','HEAD_CFC_OPERATIONS','CFC-OPERATIONS')
)
INSERT INTO public.position_assignments (user_id, position_id, organisation_unit_id, effective_from, is_primary, status)
SELECT d.user_id, p.id, ou.id, CURRENT_DATE - 30, true, 'ACTIVE'
FROM demo d
JOIN public.positions p ON p.code = d.position_code
JOIN public.organisation_units ou ON ou.code = d.unit_code;