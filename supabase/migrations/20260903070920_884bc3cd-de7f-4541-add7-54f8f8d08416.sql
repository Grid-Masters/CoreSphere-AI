-- ============================================================
-- PART 1A: Package B residual hardening
-- ============================================================

-- B-R05: self-only knowledge capability probe
CREATE OR REPLACE FUNCTION public.has_any_knowledge_capability(_user_id uuid, _codes text[])
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT _user_id IS NOT NULL
     AND _user_id = auth.uid()
     AND EXISTS (SELECT 1 FROM unnest(_codes) c WHERE public.has_capability(auth.uid(), c));
$$;

-- B-R06: NULL-safe placement uniqueness
ALTER TABLE public.knowledge_placements
  DROP CONSTRAINT IF EXISTS knowledge_placements_knowledge_version_id_platform_module_i_key;

CREATE UNIQUE INDEX IF NOT EXISTS knowledge_placements_uniq_with_section
  ON public.knowledge_placements (knowledge_version_id, platform_module_id, module_section_id)
  WHERE module_section_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS knowledge_placements_uniq_no_section
  ON public.knowledge_placements (knowledge_version_id, platform_module_id)
  WHERE module_section_id IS NULL;

-- ============================================================
-- PART 2E: Conflict / supersession governance
-- ============================================================

CREATE TABLE public.knowledge_conflict_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_key text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  severity text NOT NULL DEFAULT 'MEDIUM' CHECK (severity IN ('LOW','MEDIUM','HIGH','CRITICAL')),
  status text NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN','UNDER_REVIEW','AWAITING_CLARIFICATION','DECIDED','ARCHIVED')),
  registered_by uuid NOT NULL,
  reviewed_by uuid,
  reviewed_at timestamptz,
  decided_by uuid,
  decided_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.knowledge_conflict_cases TO authenticated;
GRANT ALL ON public.knowledge_conflict_cases TO service_role;
ALTER TABLE public.knowledge_conflict_cases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Conflict cases readable by conflict governance" ON public.knowledge_conflict_cases
  FOR SELECT TO authenticated USING (public.has_capability(auth.uid(), 'knowledge.conflict.view'));
CREATE TRIGGER trg_conflict_cases_updated BEFORE UPDATE ON public.knowledge_conflict_cases
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.conflict_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conflict_case_id uuid NOT NULL REFERENCES public.knowledge_conflict_cases(id) ON DELETE CASCADE,
  knowledge_version_id uuid NOT NULL REFERENCES public.knowledge_record_versions(id) ON DELETE RESTRICT,
  position_note text,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (conflict_case_id, knowledge_version_id)
);
GRANT SELECT ON public.conflict_items TO authenticated;
GRANT ALL ON public.conflict_items TO service_role;
ALTER TABLE public.conflict_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Conflict items readable by conflict governance" ON public.conflict_items
  FOR SELECT TO authenticated USING (public.has_capability(auth.uid(), 'knowledge.conflict.view'));
CREATE INDEX idx_conflict_items_version ON public.conflict_items (knowledge_version_id);

CREATE TABLE public.conflict_evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conflict_case_id uuid NOT NULL REFERENCES public.knowledge_conflict_cases(id) ON DELETE CASCADE,
  source_version_id uuid REFERENCES public.source_document_versions(id) ON DELETE RESTRICT,
  evidence_note text NOT NULL,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.conflict_evidence TO authenticated;
GRANT ALL ON public.conflict_evidence TO service_role;
ALTER TABLE public.conflict_evidence ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Conflict evidence readable by conflict governance" ON public.conflict_evidence
  FOR SELECT TO authenticated USING (public.has_capability(auth.uid(), 'knowledge.conflict.view'));

CREATE TABLE public.clarification_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conflict_case_id uuid NOT NULL REFERENCES public.knowledge_conflict_cases(id) ON DELETE CASCADE,
  target_user_id uuid,
  target_org_unit_id uuid REFERENCES public.organisation_units(id),
  question text NOT NULL,
  status text NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN','ANSWERED','CLOSED')),
  due_date date,
  requested_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (target_user_id IS NOT NULL OR target_org_unit_id IS NOT NULL)
);
GRANT SELECT ON public.clarification_requests TO authenticated;
GRANT ALL ON public.clarification_requests TO service_role;
ALTER TABLE public.clarification_requests ENABLE ROW LEVEL SECURITY;
-- Conflict governance sees all; a respondent sees ONLY requests addressed to them
-- (this grants no access to the case itself, so no Conflict Queue access is implied).
CREATE POLICY "Clarification requests readable by governance" ON public.clarification_requests
  FOR SELECT TO authenticated USING (public.has_capability(auth.uid(), 'knowledge.conflict.view'));
CREATE POLICY "Clarification requests readable by addressee" ON public.clarification_requests
  FOR SELECT TO authenticated USING (target_user_id = auth.uid());
CREATE TRIGGER trg_clarification_requests_updated BEFORE UPDATE ON public.clarification_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_clarification_requests_target ON public.clarification_requests (target_user_id);

CREATE TABLE public.clarification_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clarification_request_id uuid NOT NULL REFERENCES public.clarification_requests(id) ON DELETE CASCADE,
  responder_user_id uuid NOT NULL,
  response_text text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.clarification_responses TO authenticated;
GRANT ALL ON public.clarification_responses TO service_role;
ALTER TABLE public.clarification_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clarification responses readable by governance" ON public.clarification_responses
  FOR SELECT TO authenticated USING (public.has_capability(auth.uid(), 'knowledge.conflict.view'));
CREATE POLICY "Clarification responses readable by responder" ON public.clarification_responses
  FOR SELECT TO authenticated USING (responder_user_id = auth.uid());
CREATE TRIGGER clarification_responses_no_update BEFORE UPDATE ON public.clarification_responses
  FOR EACH ROW EXECUTE FUNCTION public.block_audit_mutation();
CREATE TRIGGER clarification_responses_no_delete BEFORE DELETE ON public.clarification_responses
  FOR EACH ROW EXECUTE FUNCTION public.block_audit_mutation();

CREATE TABLE public.conflict_decisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conflict_case_id uuid NOT NULL REFERENCES public.knowledge_conflict_cases(id) ON DELETE RESTRICT,
  decision_type text NOT NULL CHECK (decision_type IN ('NO_CONFLICT','UPHOLD','AMEND_REQUIRED','SUPERSEDE','ESCALATE')),
  rationale text NOT NULL,
  decided_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.conflict_decisions TO authenticated;
GRANT ALL ON public.conflict_decisions TO service_role;
ALTER TABLE public.conflict_decisions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Conflict decisions readable by conflict governance" ON public.conflict_decisions
  FOR SELECT TO authenticated USING (public.has_capability(auth.uid(), 'knowledge.conflict.view'));
CREATE TRIGGER conflict_decisions_no_update BEFORE UPDATE ON public.conflict_decisions
  FOR EACH ROW EXECUTE FUNCTION public.block_audit_mutation();
CREATE TRIGGER conflict_decisions_no_delete BEFORE DELETE ON public.conflict_decisions
  FOR EACH ROW EXECUTE FUNCTION public.block_audit_mutation();

CREATE TABLE public.supersession_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conflict_case_id uuid REFERENCES public.knowledge_conflict_cases(id) ON DELETE SET NULL,
  superseded_version_id uuid NOT NULL REFERENCES public.knowledge_record_versions(id) ON DELETE RESTRICT,
  replacement_version_id uuid NOT NULL REFERENCES public.knowledge_record_versions(id) ON DELETE RESTRICT,
  effective_from date NOT NULL DEFAULT CURRENT_DATE,
  note text,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (superseded_version_id, replacement_version_id),
  CHECK (superseded_version_id <> replacement_version_id)
);
GRANT SELECT ON public.supersession_links TO authenticated;
GRANT ALL ON public.supersession_links TO service_role;
ALTER TABLE public.supersession_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Supersession links readable by knowledge governance" ON public.supersession_links
  FOR SELECT TO authenticated USING (
    public.has_any_knowledge_capability(auth.uid(), ARRAY['knowledge.conflict.view','knowledge.record.review','knowledge.record.approve','knowledge.record.publish'])
  );
CREATE INDEX idx_supersession_superseded ON public.supersession_links (superseded_version_id);

-- ============================================================
-- PART 2G: Unified governed publication model
-- ============================================================

CREATE TABLE public.publications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  publication_type text NOT NULL CHECK (publication_type IN ('FAQ','ALERT','LEARNING_PULSE','LEADERSHIP','MEMO','TOWNHALL')),
  title text NOT NULL,
  summary text,
  body text,
  category text,
  priority text NOT NULL DEFAULT 'NORMAL' CHECK (priority IN ('LOW','NORMAL','HIGH','CRITICAL')),
  status text NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT','IN_REVIEW','APPROVED','PUBLISHED','ARCHIVED')),
  effective_from timestamptz,
  effective_to timestamptz,
  requires_acknowledgement boolean NOT NULL DEFAULT false,
  owner_org_unit_id uuid REFERENCES public.organisation_units(id),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by uuid NOT NULL,
  reviewed_by uuid,
  reviewed_at timestamptz,
  approved_by uuid,
  approved_at timestamptz,
  published_by uuid,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.publications TO authenticated;
GRANT ALL ON public.publications TO service_role;
ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;
-- Staff visibility is evaluated server-side against audience rules; the only
-- client-side read path is for people who author/govern publications.
CREATE POLICY "Publications readable by publication governance" ON public.publications
  FOR SELECT TO authenticated USING (
    created_by = auth.uid()
    OR public.has_capability(auth.uid(), 'publication.faq.manage_team')
    OR public.has_capability(auth.uid(), 'publication.faq.approve_department')
    OR public.has_capability(auth.uid(), 'publication.learning_pulse.review')
    OR public.has_capability(auth.uid(), 'publication.learning_pulse.publish')
    OR public.has_capability(auth.uid(), 'publication.townhall.review')
    OR public.has_capability(auth.uid(), 'publication.townhall.publish')
    OR public.has_capability(auth.uid(), 'publication.alert.publish_enterprise')
    OR public.has_capability(auth.uid(), 'publication.memo.publish_enterprise')
    OR public.has_capability(auth.uid(), 'publication.leadership.publish')
  );
CREATE TRIGGER trg_publications_updated BEFORE UPDATE ON public.publications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_publications_type_status ON public.publications (publication_type, status);
CREATE INDEX idx_publications_effective ON public.publications (effective_from, effective_to);

CREATE TABLE public.publication_audience_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  publication_id uuid NOT NULL REFERENCES public.publications(id) ON DELETE CASCADE,
  rule_type text NOT NULL CHECK (rule_type IN ('INCLUDE','EXCLUDE')),
  country_code text,
  org_unit_id uuid REFERENCES public.organisation_units(id),
  include_descendants boolean NOT NULL DEFAULT true,
  position_id uuid REFERENCES public.positions(id),
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.publication_audience_rules TO authenticated;
GRANT ALL ON public.publication_audience_rules TO service_role;
ALTER TABLE public.publication_audience_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Audience rules readable with their publication" ON public.publication_audience_rules
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.publications p WHERE p.id = publication_id)
  );
CREATE INDEX idx_publication_audience_pub ON public.publication_audience_rules (publication_id);

CREATE TABLE public.publication_receipts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  publication_id uuid NOT NULL REFERENCES public.publications(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  viewed_at timestamptz,
  acknowledged_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (publication_id, user_id)
);
GRANT SELECT ON public.publication_receipts TO authenticated;
GRANT ALL ON public.publication_receipts TO service_role;
ALTER TABLE public.publication_receipts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own publication receipts" ON public.publication_receipts
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE TRIGGER trg_publication_receipts_updated BEFORE UPDATE ON public.publication_receipts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_publication_receipts_user ON public.publication_receipts (user_id);

CREATE TABLE public.publication_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  publication_id uuid NOT NULL REFERENCES public.publications(id) ON DELETE CASCADE,
  asset_kind text NOT NULL DEFAULT 'MEDIA' CHECK (asset_kind IN ('MEDIA','DOCUMENT','THUMBNAIL')),
  storage_bucket text NOT NULL,
  storage_object_key text NOT NULL,
  original_file_name text NOT NULL,
  mime_type text,
  byte_size bigint,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.publication_assets TO authenticated;
GRANT ALL ON public.publication_assets TO service_role;
ALTER TABLE public.publication_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Publication assets readable with their publication" ON public.publication_assets
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.publications p WHERE p.id = publication_id)
  );

-- Suggestion governance history
CREATE TABLE public.suggestion_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  suggestion_id uuid NOT NULL REFERENCES public.suggestions(id) ON DELETE CASCADE,
  decision text NOT NULL CHECK (decision IN ('ACKNOWLEDGED','UNDER_REVIEW','ACCEPTED','DECLINED','IMPLEMENTED')),
  notes text,
  reviewer_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.suggestion_reviews TO authenticated;
GRANT ALL ON public.suggestion_reviews TO service_role;
ALTER TABLE public.suggestion_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Suggestion reviews readable by submitter or reviewer" ON public.suggestion_reviews
  FOR SELECT TO authenticated USING (
    reviewer_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.suggestions s WHERE s.id = suggestion_id AND s.user_id = auth.uid())
    OR public.has_capability(auth.uid(), 'suggestion.review.department')
    OR public.has_capability(auth.uid(), 'suggestion.review.enterprise')
  );
CREATE TRIGGER suggestion_reviews_no_update BEFORE UPDATE ON public.suggestion_reviews
  FOR EACH ROW EXECUTE FUNCTION public.block_audit_mutation();
CREATE TRIGGER suggestion_reviews_no_delete BEFORE DELETE ON public.suggestion_reviews
  FOR EACH ROW EXECUTE FUNCTION public.block_audit_mutation();

-- ============================================================
-- Capabilities and conservative position mappings
-- ============================================================

INSERT INTO public.capabilities (code, name, description, domain, is_active) VALUES
  ('publication.faq.manage_team', 'Manage team FAQ drafts', 'Create and edit FAQ publication drafts for own team scope', 'COMMUNICATION', true),
  ('publication.faq.approve_department', 'Approve department FAQs', 'Approve and publish FAQ publications for own department scope', 'COMMUNICATION', true),
  ('publication.learning_pulse.create', 'Create Learning Pulse', 'Create Learning Pulse publication drafts', 'COMMUNICATION', true),
  ('publication.learning_pulse.review', 'Review Learning Pulse', 'Review Learning Pulse publications', 'COMMUNICATION', true),
  ('publication.learning_pulse.publish', 'Publish Learning Pulse', 'Approve and publish Learning Pulse publications', 'COMMUNICATION', true),
  ('publication.townhall.create', 'Create Townhall', 'Create Townhall publication drafts', 'COMMUNICATION', true),
  ('publication.townhall.review', 'Review Townhall', 'Review Townhall publications', 'COMMUNICATION', true),
  ('publication.townhall.publish', 'Publish Townhall', 'Approve and publish Townhall publications', 'COMMUNICATION', true),
  ('publication.alert.publish_enterprise', 'Publish enterprise alerts', 'Publish enterprise operational alerts', 'COMMUNICATION', true),
  ('publication.memo.publish_enterprise', 'Publish enterprise memos', 'Publish enterprise operational memos', 'COMMUNICATION', true),
  ('publication.leadership.publish', 'Publish leadership items', 'Publish leadership board communications', 'COMMUNICATION', true),
  ('suggestion.review.department', 'Review department suggestions', 'Review and resolve suggestions within own department', 'COMMUNICATION', true),
  ('suggestion.review.enterprise', 'Review enterprise suggestions', 'Enterprise-wide suggestion oversight', 'COMMUNICATION', true)
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.position_capabilities (position_id, capability_id, default_scope_type)
SELECT p.id, c.id, m.scope::capability_scope_type
FROM (VALUES
  ('TEAM_LEAD','publication.faq.manage_team','TEAM'),
  ('UNIT_HEAD','publication.faq.approve_department','DEPARTMENT'),
  ('UNIT_HEAD','suggestion.review.department','DEPARTMENT'),
  ('LD_OFFICER','publication.learning_pulse.create','ENTERPRISE'),
  ('LD_OFFICER','publication.townhall.create','ENTERPRISE'),
  ('LD_TEAM_LEAD','publication.learning_pulse.create','ENTERPRISE'),
  ('LD_TEAM_LEAD','publication.learning_pulse.review','ENTERPRISE'),
  ('LD_TEAM_LEAD','publication.townhall.create','ENTERPRISE'),
  ('LD_TEAM_LEAD','publication.townhall.review','ENTERPRISE'),
  ('LD_UNIT_HEAD','publication.learning_pulse.review','ENTERPRISE'),
  ('LD_UNIT_HEAD','publication.learning_pulse.publish','ENTERPRISE'),
  ('LD_UNIT_HEAD','publication.townhall.review','ENTERPRISE'),
  ('LD_UNIT_HEAD','publication.townhall.publish','ENTERPRISE'),
  ('HEAD_CFC_OPERATIONS','publication.alert.publish_enterprise','ENTERPRISE'),
  ('HEAD_CFC_OPERATIONS','publication.memo.publish_enterprise','ENTERPRISE'),
  ('HEAD_CFC_OPERATIONS','suggestion.review.enterprise','ENTERPRISE'),
  ('GROUP_HEAD','publication.leadership.publish','ENTERPRISE'),
  ('GROUP_HEAD','publication.memo.publish_enterprise','ENTERPRISE'),
  ('GROUP_HEAD','publication.alert.publish_enterprise','ENTERPRISE'),
  ('GROUP_HEAD','suggestion.review.enterprise','ENTERPRISE'),
  ('GROUP_HEAD','knowledge.conflict.decide','ENTERPRISE')
) AS m(position_code, capability_code, scope)
JOIN public.positions p ON p.code = m.position_code
JOIN public.capabilities c ON c.code = m.capability_code
ON CONFLICT DO NOTHING;