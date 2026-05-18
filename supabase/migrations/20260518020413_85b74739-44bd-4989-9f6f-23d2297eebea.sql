
-- Role enum + helper (security-definer to avoid RLS recursion)
CREATE TYPE public.app_role AS ENUM ('staff', 'qa', 'ld', 'team_lead', 'group_head');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  display_name TEXT,
  department TEXT,
  unit TEXT,
  role_label TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE TABLE public.acknowledgments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  target_kind TEXT NOT NULL,           -- 'sop' | 'announcement' | 'memo' | 'incident'
  target_id TEXT NOT NULL,
  target_version TEXT,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  acknowledged_at TIMESTAMPTZ,
  confirmation_text TEXT,
  UNIQUE (user_id, target_kind, target_id, target_version)
);
CREATE INDEX idx_ack_user ON public.acknowledgments (user_id);
CREATE INDEX idx_ack_target ON public.acknowledgments (target_kind, target_id);

CREATE TABLE public.sop_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sop_id TEXT NOT NULL,
  version TEXT NOT NULL,
  updated_by TEXT NOT NULL,
  approved_by TEXT,
  change_summary TEXT,
  archived BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (sop_id, version)
);
CREATE INDEX idx_sopv_sop ON public.sop_versions (sop_id);

CREATE TABLE public.onboarding_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  milestone_key TEXT NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, milestone_key)
);

CREATE TABLE public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  cert_type TEXT NOT NULL,
  title TEXT NOT NULL,
  score INT,
  badge_key TEXT,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_cert_user ON public.certificates (user_id);

CREATE TABLE public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  context_type TEXT NOT NULL,         -- 'sop' | 'coaching' | 'assessment' | 'training' | 'ai'
  context_id TEXT NOT NULL,
  rating TEXT NOT NULL,               -- 'helpful' | 'neutral' | 'needs_clarification'
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_feedback_ctx ON public.feedback (context_type, context_id);

CREATE TABLE public.failed_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  query TEXT NOT NULL,
  department TEXT,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_failed_query ON public.failed_searches (query);

CREATE TABLE public.incident_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  severity TEXT NOT NULL,             -- 'critical' | 'high' | 'medium' | 'low'
  affected_systems TEXT,
  active_from TIMESTAMPTZ NOT NULL DEFAULT now(),
  active_to TIMESTAMPTZ,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.risk_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  score INT NOT NULL,
  level TEXT NOT NULL,                -- 'low' | 'moderate' | 'high'
  factors JSONB,
  computed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_risk_user ON public.risk_snapshots (user_id);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.acknowledgments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sop_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.failed_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incident_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_snapshots ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Leaders view all profiles" ON public.profiles FOR SELECT TO authenticated USING (
  public.has_role(auth.uid(), 'ld') OR public.has_role(auth.uid(), 'team_lead') OR public.has_role(auth.uid(), 'group_head') OR public.has_role(auth.uid(), 'qa')
);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- user_roles (read-only to user; managed by admin via service role)
CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Group head views all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'group_head'));

-- acknowledgments
CREATE POLICY "Users view own acks" ON public.acknowledgments FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Leaders view all acks" ON public.acknowledgments FOR SELECT TO authenticated USING (
  public.has_role(auth.uid(), 'ld') OR public.has_role(auth.uid(), 'team_lead') OR public.has_role(auth.uid(), 'group_head')
);
CREATE POLICY "Users insert own acks" ON public.acknowledgments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own acks" ON public.acknowledgments FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- sop_versions (read-all-authenticated, write L&D only)
CREATE POLICY "Authenticated view sop versions" ON public.sop_versions FOR SELECT TO authenticated USING (true);
CREATE POLICY "L&D manages sop versions" ON public.sop_versions FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'ld'))
  WITH CHECK (public.has_role(auth.uid(), 'ld'));

-- onboarding_progress
CREATE POLICY "Users view own onboarding" ON public.onboarding_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Leaders view all onboarding" ON public.onboarding_progress FOR SELECT TO authenticated USING (
  public.has_role(auth.uid(), 'ld') OR public.has_role(auth.uid(), 'team_lead') OR public.has_role(auth.uid(), 'group_head')
);
CREATE POLICY "Users write own onboarding" ON public.onboarding_progress FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- certificates
CREATE POLICY "Users view own certificates" ON public.certificates FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Leaders view all certificates" ON public.certificates FOR SELECT TO authenticated USING (
  public.has_role(auth.uid(), 'ld') OR public.has_role(auth.uid(), 'team_lead') OR public.has_role(auth.uid(), 'group_head')
);
CREATE POLICY "Users insert own certificates" ON public.certificates FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- feedback
CREATE POLICY "Users view own feedback" ON public.feedback FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "L&D views all feedback" ON public.feedback FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ld'));
CREATE POLICY "Users insert own feedback" ON public.feedback FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- failed_searches (everyone authenticated can insert; L&D reads aggregate)
CREATE POLICY "Authenticated insert failed search" ON public.failed_searches FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "L&D and group head read failed searches" ON public.failed_searches FOR SELECT TO authenticated USING (
  public.has_role(auth.uid(), 'ld') OR public.has_role(auth.uid(), 'group_head')
);

-- incident_banners (everyone authenticated reads active; L&D / group head write)
CREATE POLICY "Authenticated view incidents" ON public.incident_banners FOR SELECT TO authenticated USING (true);
CREATE POLICY "Leaders manage incidents" ON public.incident_banners FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'ld') OR public.has_role(auth.uid(), 'group_head'))
  WITH CHECK (public.has_role(auth.uid(), 'ld') OR public.has_role(auth.uid(), 'group_head'));

-- risk_snapshots
CREATE POLICY "Users view own risk" ON public.risk_snapshots FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Leaders view all risk" ON public.risk_snapshots FOR SELECT TO authenticated USING (
  public.has_role(auth.uid(), 'team_lead') OR public.has_role(auth.uid(), 'qa') OR public.has_role(auth.uid(), 'ld') OR public.has_role(auth.uid(), 'group_head')
);
CREATE POLICY "System insert risk via service role" ON public.risk_snapshots FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- update_updated_at trigger for profiles
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
