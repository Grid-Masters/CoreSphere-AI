
-- ============================================================
-- Package B — Knowledge Governance Core
-- Every table: RLS on, capability-gated SELECT only.
-- All mutations occur through server functions (service_role).
-- ============================================================

CREATE OR REPLACE FUNCTION public.has_any_knowledge_capability(_user_id uuid, _codes text[])
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM unnest(_codes) c WHERE public.has_capability(_user_id, c));
$$;

-- ---------- SOURCE VAULT ----------

CREATE TABLE public.source_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_key text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  source_type text NOT NULL CHECK (source_type IN ('SOP','POLICY','PRODUCT_GUIDE','LOGGING_GUIDE','FORM','DIRECTORY','MINUTES','WEEKLY_DIGEST','DID_YOU_KNOW','BRIEFING_POINT','TRAINING_MATERIAL','VIDEO','OTHER')),
  source_owner_name text,
  source_owner_org_unit_id uuid REFERENCES public.organisation_units(id),
  source_date date,
  received_at timestamptz NOT NULL DEFAULT now(),
  confidentiality text NOT NULL DEFAULT 'INTERNAL' CHECK (confidentiality IN ('INTERNAL','RESTRICTED','CONFIDENTIAL','CUSTOMER_FACING')),
  status text NOT NULL DEFAULT 'REGISTERED' CHECK (status IN ('REGISTERED','UNDER_REVIEW','CHANGES_REQUIRED','APPROVED','REJECTED','ARCHIVED')),
  parsing_status text NOT NULL DEFAULT 'PENDING' CHECK (parsing_status IN ('PENDING','PARTIAL','COMPLETE','FAILED','NOT_APPLICABLE')),
  requires_redaction boolean NOT NULL DEFAULT false,
  is_synthetic boolean NOT NULL DEFAULT false,
  registered_by uuid NOT NULL,
  approved_by uuid,
  approved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.source_documents TO authenticated;
GRANT ALL ON public.source_documents TO service_role;
ALTER TABLE public.source_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Knowledge governance can view sources" ON public.source_documents
  FOR SELECT TO authenticated
  USING (public.has_any_knowledge_capability(auth.uid(), ARRAY['knowledge.source.register','knowledge.source.review','knowledge.source.approve','knowledge.record.create','knowledge.record.review','knowledge.record.approve','knowledge.record.publish']));
CREATE INDEX idx_source_documents_status ON public.source_documents(status);
CREATE INDEX idx_source_documents_type ON public.source_documents(source_type);
CREATE INDEX idx_source_documents_owner_unit ON public.source_documents(source_owner_org_unit_id);
CREATE TRIGGER trg_source_documents_updated BEFORE UPDATE ON public.source_documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.source_document_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_document_id uuid NOT NULL REFERENCES public.source_documents(id) ON DELETE RESTRICT,
  version_number integer NOT NULL CHECK (version_number > 0),
  original_file_name text NOT NULL,
  storage_bucket text NOT NULL DEFAULT 'knowledge-source-vault',
  storage_object_key text NOT NULL,
  mime_type text,
  byte_size bigint,
  sha256 text,
  checksum_verification_method text NOT NULL DEFAULT 'UNVERIFIED'
    CHECK (checksum_verification_method IN ('SERVER_COMPUTED','CLIENT_COMPUTED_SERVER_METADATA_REVALIDATED','UNVERIFIED')),
  source_date date,
  version_label text,
  uploaded_by uuid NOT NULL,
  uploaded_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  UNIQUE (source_document_id, version_number),
  UNIQUE (storage_bucket, storage_object_key)
);
GRANT SELECT ON public.source_document_versions TO authenticated;
GRANT ALL ON public.source_document_versions TO service_role;
ALTER TABLE public.source_document_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Knowledge governance can view source versions" ON public.source_document_versions
  FOR SELECT TO authenticated
  USING (public.has_any_knowledge_capability(auth.uid(), ARRAY['knowledge.source.register','knowledge.source.review','knowledge.source.approve','knowledge.record.create','knowledge.record.review','knowledge.record.approve','knowledge.record.publish']));
CREATE INDEX idx_source_versions_document ON public.source_document_versions(source_document_id);
CREATE INDEX idx_source_versions_sha256 ON public.source_document_versions(sha256);

CREATE TABLE public.source_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_version_id uuid NOT NULL REFERENCES public.source_document_versions(id) ON DELETE RESTRICT,
  section_order integer NOT NULL,
  heading text,
  page_number integer,
  content_text text,
  section_hash text,
  contains_sensitive_data boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (source_version_id, section_order)
);
GRANT SELECT ON public.source_sections TO authenticated;
GRANT ALL ON public.source_sections TO service_role;
ALTER TABLE public.source_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Knowledge governance can view source sections" ON public.source_sections
  FOR SELECT TO authenticated
  USING (public.has_any_knowledge_capability(auth.uid(), ARRAY['knowledge.source.register','knowledge.source.review','knowledge.source.approve','knowledge.record.create','knowledge.record.review','knowledge.record.approve','knowledge.record.publish']));

CREATE TABLE public.source_duplicate_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  duplicate_type text NOT NULL CHECK (duplicate_type IN ('EXACT','NEAR')),
  status text NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN','RESOLVED')),
  reason text,
  notes text,
  signature text,
  preferred_source_version_id uuid REFERENCES public.source_document_versions(id),
  created_by uuid,
  resolved_by uuid,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.source_duplicate_groups TO authenticated;
GRANT ALL ON public.source_duplicate_groups TO service_role;
ALTER TABLE public.source_duplicate_groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Knowledge governance can view duplicate groups" ON public.source_duplicate_groups
  FOR SELECT TO authenticated
  USING (public.has_any_knowledge_capability(auth.uid(), ARRAY['knowledge.source.register','knowledge.source.review','knowledge.source.approve']));
CREATE UNIQUE INDEX idx_source_duplicate_groups_exact_signature
  ON public.source_duplicate_groups(signature) WHERE duplicate_type = 'EXACT';
CREATE TRIGGER trg_source_duplicate_groups_updated BEFORE UPDATE ON public.source_duplicate_groups
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.source_duplicate_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.source_duplicate_groups(id) ON DELETE CASCADE,
  source_version_id uuid NOT NULL REFERENCES public.source_document_versions(id) ON DELETE RESTRICT,
  similarity_score numeric,
  evidence_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (group_id, source_version_id)
);
GRANT SELECT ON public.source_duplicate_members TO authenticated;
GRANT ALL ON public.source_duplicate_members TO service_role;
ALTER TABLE public.source_duplicate_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Knowledge governance can view duplicate members" ON public.source_duplicate_members
  FOR SELECT TO authenticated
  USING (public.has_any_knowledge_capability(auth.uid(), ARRAY['knowledge.source.register','knowledge.source.review','knowledge.source.approve']));

CREATE TABLE public.source_redactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_version_id uuid NOT NULL REFERENCES public.source_document_versions(id) ON DELETE RESTRICT,
  source_section_id uuid REFERENCES public.source_sections(id),
  page_number integer,
  redaction_type text NOT NULL,
  reason text NOT NULL,
  replacement_text text DEFAULT '[REDACTED]',
  is_required boolean NOT NULL DEFAULT true,
  status text NOT NULL DEFAULT 'PROPOSED' CHECK (status IN ('PROPOSED','REVIEWED','APPROVED','REJECTED')),
  proposed_by uuid NOT NULL,
  proposed_at timestamptz NOT NULL DEFAULT now(),
  reviewed_by uuid,
  reviewed_at timestamptz,
  approved_by uuid,
  approved_at timestamptz
);
GRANT SELECT ON public.source_redactions TO authenticated;
GRANT ALL ON public.source_redactions TO service_role;
ALTER TABLE public.source_redactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Knowledge governance can view redactions" ON public.source_redactions
  FOR SELECT TO authenticated
  USING (public.has_any_knowledge_capability(auth.uid(), ARRAY['knowledge.source.register','knowledge.source.review','knowledge.source.approve']));
CREATE INDEX idx_source_redactions_version ON public.source_redactions(source_version_id);
CREATE INDEX idx_source_redactions_status ON public.source_redactions(status);

CREATE TABLE public.source_registration_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_document_id uuid NOT NULL REFERENCES public.source_documents(id) ON DELETE RESTRICT,
  review_stage text NOT NULL CHECK (review_stage IN ('REVIEW','APPROVAL')),
  decision text NOT NULL CHECK (decision IN ('APPROVE','CHANGES_REQUIRED','REJECT')),
  notes text,
  reviewer_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.source_registration_reviews TO authenticated;
GRANT ALL ON public.source_registration_reviews TO service_role;
ALTER TABLE public.source_registration_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Knowledge governance can view source reviews" ON public.source_registration_reviews
  FOR SELECT TO authenticated
  USING (public.has_any_knowledge_capability(auth.uid(), ARRAY['knowledge.source.register','knowledge.source.review','knowledge.source.approve']));
CREATE INDEX idx_source_reviews_document ON public.source_registration_reviews(source_document_id, created_at DESC);

-- ---------- CANONICAL KNOWLEDGE REGISTRY ----------

CREATE TABLE public.knowledge_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  canonical_key text NOT NULL UNIQUE,
  title text NOT NULL,
  knowledge_type text NOT NULL CHECK (knowledge_type IN ('PROCEDURE','POLICY','PRODUCT','FORM','SERVICE_STANDARD','GENERAL_GUIDANCE')),
  owner_org_unit_id uuid REFERENCES public.organisation_units(id),
  status text NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','ARCHIVED')),
  is_synthetic boolean NOT NULL DEFAULT false,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.knowledge_records TO authenticated;
GRANT ALL ON public.knowledge_records TO service_role;
ALTER TABLE public.knowledge_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Knowledge governance can view records" ON public.knowledge_records
  FOR SELECT TO authenticated
  USING (public.has_any_knowledge_capability(auth.uid(), ARRAY['knowledge.record.create','knowledge.record.review','knowledge.record.approve','knowledge.record.publish']));
CREATE TRIGGER trg_knowledge_records_updated BEFORE UPDATE ON public.knowledge_records
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.knowledge_record_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  knowledge_record_id uuid NOT NULL REFERENCES public.knowledge_records(id) ON DELETE RESTRICT,
  version_number integer NOT NULL CHECK (version_number > 0),
  title text NOT NULL,
  summary text,
  content_text text,
  structured_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  workflow_status text NOT NULL DEFAULT 'DRAFT'
    CHECK (workflow_status IN ('DRAFT','IN_REVIEW','CHANGES_REQUIRED','APPROVED','PUBLISHED','REJECTED','ARCHIVED')),
  effective_from date,
  effective_to date,
  ai_eligible boolean NOT NULL DEFAULT false,
  assessment_eligible boolean NOT NULL DEFAULT false,
  scenario_eligible boolean NOT NULL DEFAULT false,
  content_hash text,
  created_by uuid NOT NULL,
  reviewed_by uuid,
  reviewed_at timestamptz,
  approved_by uuid,
  approved_at timestamptz,
  published_by uuid,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (knowledge_record_id, version_number),
  CONSTRAINT knowledge_version_effective_dates CHECK (effective_to IS NULL OR effective_from IS NULL OR effective_to >= effective_from)
);
GRANT SELECT ON public.knowledge_record_versions TO authenticated;
GRANT ALL ON public.knowledge_record_versions TO service_role;
ALTER TABLE public.knowledge_record_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Knowledge governance can view record versions" ON public.knowledge_record_versions
  FOR SELECT TO authenticated
  USING (public.has_any_knowledge_capability(auth.uid(), ARRAY['knowledge.record.create','knowledge.record.review','knowledge.record.approve','knowledge.record.publish']));
CREATE INDEX idx_knowledge_versions_record ON public.knowledge_record_versions(knowledge_record_id);
CREATE INDEX idx_knowledge_versions_status ON public.knowledge_record_versions(workflow_status);
CREATE TRIGGER trg_knowledge_versions_updated BEFORE UPDATE ON public.knowledge_record_versions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Immutability: once APPROVED/PUBLISHED, substantive fields are frozen.
CREATE OR REPLACE FUNCTION public.enforce_knowledge_version_immutability()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF OLD.workflow_status IN ('APPROVED','PUBLISHED') THEN
    IF NEW.title IS DISTINCT FROM OLD.title
       OR NEW.summary IS DISTINCT FROM OLD.summary
       OR NEW.content_text IS DISTINCT FROM OLD.content_text
       OR NEW.structured_data IS DISTINCT FROM OLD.structured_data
       OR NEW.effective_from IS DISTINCT FROM OLD.effective_from
       OR NEW.effective_to IS DISTINCT FROM OLD.effective_to
       OR NEW.ai_eligible IS DISTINCT FROM OLD.ai_eligible
       OR NEW.assessment_eligible IS DISTINCT FROM OLD.assessment_eligible
       OR NEW.scenario_eligible IS DISTINCT FROM OLD.scenario_eligible
       OR NEW.content_hash IS DISTINCT FROM OLD.content_hash
       OR NEW.knowledge_record_id IS DISTINCT FROM OLD.knowledge_record_id
       OR NEW.version_number IS DISTINCT FROM OLD.version_number THEN
      RAISE EXCEPTION 'Approved or published canonical versions are immutable. Create a new version instead.'
        USING ERRCODE = 'P0001';
    END IF;
    IF OLD.workflow_status = 'PUBLISHED' AND NEW.workflow_status NOT IN ('PUBLISHED','ARCHIVED') THEN
      RAISE EXCEPTION 'A published canonical version cannot return to an earlier workflow state.'
        USING ERRCODE = 'P0001';
    END IF;
    IF OLD.workflow_status = 'APPROVED' AND NEW.workflow_status NOT IN ('APPROVED','PUBLISHED','ARCHIVED') THEN
      RAISE EXCEPTION 'An approved canonical version may only be published or archived.'
        USING ERRCODE = 'P0001';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER knowledge_versions_immutable BEFORE UPDATE ON public.knowledge_record_versions
  FOR EACH ROW EXECUTE FUNCTION public.enforce_knowledge_version_immutability();

-- Source version identity is immutable evidence.
CREATE OR REPLACE FUNCTION public.block_source_version_mutation()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    RAISE EXCEPTION 'Source Vault evidence is append-only and cannot be deleted.' USING ERRCODE = 'P0001';
  END IF;
  IF NEW.storage_bucket IS DISTINCT FROM OLD.storage_bucket
     OR NEW.storage_object_key IS DISTINCT FROM OLD.storage_object_key
     OR NEW.source_document_id IS DISTINCT FROM OLD.source_document_id
     OR NEW.version_number IS DISTINCT FROM OLD.version_number
     OR (OLD.sha256 IS NOT NULL AND NEW.sha256 IS DISTINCT FROM OLD.sha256)
     OR NEW.original_file_name IS DISTINCT FROM OLD.original_file_name THEN
    RAISE EXCEPTION 'Source Vault evidence identity is immutable.' USING ERRCODE = 'P0001';
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER source_versions_immutable BEFORE UPDATE OR DELETE ON public.source_document_versions
  FOR EACH ROW EXECUTE FUNCTION public.block_source_version_mutation();

CREATE TABLE public.knowledge_source_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  knowledge_version_id uuid NOT NULL REFERENCES public.knowledge_record_versions(id) ON DELETE RESTRICT,
  source_version_id uuid NOT NULL REFERENCES public.source_document_versions(id) ON DELETE RESTRICT,
  source_section_id uuid REFERENCES public.source_sections(id),
  relationship_type text NOT NULL CHECK (relationship_type IN ('PRIMARY_EVIDENCE','SUPPORTING_EVIDENCE','CONTEXT_ONLY')),
  evidence_note text,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX idx_knowledge_source_links_unique
  ON public.knowledge_source_links(knowledge_version_id, source_version_id, COALESCE(source_section_id, '00000000-0000-0000-0000-000000000000'::uuid));
GRANT SELECT ON public.knowledge_source_links TO authenticated;
GRANT ALL ON public.knowledge_source_links TO service_role;
ALTER TABLE public.knowledge_source_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Knowledge governance can view evidence links" ON public.knowledge_source_links
  FOR SELECT TO authenticated
  USING (public.has_any_knowledge_capability(auth.uid(), ARRAY['knowledge.record.create','knowledge.record.review','knowledge.record.approve','knowledge.record.publish']));

CREATE OR REPLACE FUNCTION public.block_locked_evidence_link_mutation()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  st TEXT;
BEGIN
  SELECT workflow_status INTO st FROM public.knowledge_record_versions
   WHERE id = COALESCE(OLD.knowledge_version_id, NEW.knowledge_version_id);
  IF st IN ('APPROVED','PUBLISHED') THEN
    RAISE EXCEPTION 'Evidence links of an approved or published canonical version are immutable.'
      USING ERRCODE = 'P0001';
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;
CREATE TRIGGER knowledge_source_links_locked BEFORE UPDATE OR DELETE ON public.knowledge_source_links
  FOR EACH ROW EXECUTE FUNCTION public.block_locked_evidence_link_mutation();

CREATE TABLE public.knowledge_version_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  knowledge_version_id uuid NOT NULL REFERENCES public.knowledge_record_versions(id) ON DELETE RESTRICT,
  review_stage text NOT NULL CHECK (review_stage IN ('REVIEW','APPROVAL','PUBLISH')),
  decision text NOT NULL CHECK (decision IN ('APPROVE','CHANGES_REQUIRED','REJECT','PUBLISH')),
  notes text,
  reviewer_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.knowledge_version_reviews TO authenticated;
GRANT ALL ON public.knowledge_version_reviews TO service_role;
ALTER TABLE public.knowledge_version_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Knowledge governance can view version reviews" ON public.knowledge_version_reviews
  FOR SELECT TO authenticated
  USING (public.has_any_knowledge_capability(auth.uid(), ARRAY['knowledge.record.create','knowledge.record.review','knowledge.record.approve','knowledge.record.publish']));
CREATE INDEX idx_knowledge_version_reviews_version ON public.knowledge_version_reviews(knowledge_version_id, created_at DESC);

-- ---------- SPECIALISED MODELS ----------

CREATE TABLE public.procedure_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  knowledge_record_id uuid NOT NULL UNIQUE REFERENCES public.knowledge_records(id) ON DELETE RESTRICT,
  procedure_code text,
  primary_system text,
  owner_org_unit_id uuid REFERENCES public.organisation_units(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.procedure_profiles TO authenticated;
GRANT ALL ON public.procedure_profiles TO service_role;
ALTER TABLE public.procedure_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Knowledge governance can view procedure profiles" ON public.procedure_profiles
  FOR SELECT TO authenticated
  USING (public.has_any_knowledge_capability(auth.uid(), ARRAY['knowledge.record.create','knowledge.record.review','knowledge.record.approve','knowledge.record.publish']));

CREATE TABLE public.procedure_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  knowledge_version_id uuid NOT NULL REFERENCES public.knowledge_record_versions(id) ON DELETE RESTRICT,
  step_number integer NOT NULL CHECK (step_number > 0),
  title text,
  instruction_text text NOT NULL,
  warning_text text,
  expected_outcome text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (knowledge_version_id, step_number)
);
GRANT SELECT ON public.procedure_steps TO authenticated;
GRANT ALL ON public.procedure_steps TO service_role;
ALTER TABLE public.procedure_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Knowledge governance can view procedure steps" ON public.procedure_steps
  FOR SELECT TO authenticated
  USING (public.has_any_knowledge_capability(auth.uid(), ARRAY['knowledge.record.create','knowledge.record.review','knowledge.record.approve','knowledge.record.publish']));

CREATE TABLE public.product_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  knowledge_record_id uuid NOT NULL UNIQUE REFERENCES public.knowledge_records(id) ON DELETE RESTRICT,
  product_code text,
  product_family text,
  product_category text,
  owner_org_unit_id uuid REFERENCES public.organisation_units(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.product_profiles TO authenticated;
GRANT ALL ON public.product_profiles TO service_role;
ALTER TABLE public.product_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Knowledge governance can view product profiles" ON public.product_profiles
  FOR SELECT TO authenticated
  USING (public.has_any_knowledge_capability(auth.uid(), ARRAY['knowledge.record.create','knowledge.record.review','knowledge.record.approve','knowledge.record.publish']));

CREATE TABLE public.product_attribute_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  knowledge_version_id uuid NOT NULL REFERENCES public.knowledge_record_versions(id) ON DELETE RESTRICT,
  attribute_key text NOT NULL,
  attribute_label text NOT NULL,
  value_text text,
  unit text,
  currency text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (knowledge_version_id, attribute_key)
);
GRANT SELECT ON public.product_attribute_versions TO authenticated;
GRANT ALL ON public.product_attribute_versions TO service_role;
ALTER TABLE public.product_attribute_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Knowledge governance can view product attributes" ON public.product_attribute_versions
  FOR SELECT TO authenticated
  USING (public.has_any_knowledge_capability(auth.uid(), ARRAY['knowledge.record.create','knowledge.record.review','knowledge.record.approve','knowledge.record.publish']));

CREATE TABLE public.product_availability_periods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  knowledge_version_id uuid NOT NULL REFERENCES public.knowledge_record_versions(id) ON DELETE RESTRICT,
  country_code text,
  channel text,
  available_from date,
  available_to date,
  is_available boolean NOT NULL DEFAULT true,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.product_availability_periods TO authenticated;
GRANT ALL ON public.product_availability_periods TO service_role;
ALTER TABLE public.product_availability_periods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Knowledge governance can view product availability" ON public.product_availability_periods
  FOR SELECT TO authenticated
  USING (public.has_any_knowledge_capability(auth.uid(), ARRAY['knowledge.record.create','knowledge.record.review','knowledge.record.approve','knowledge.record.publish']));

CREATE TABLE public.form_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  knowledge_record_id uuid NOT NULL UNIQUE REFERENCES public.knowledge_records(id) ON DELETE RESTRICT,
  form_code text,
  customer_facing boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.form_profiles TO authenticated;
GRANT ALL ON public.form_profiles TO service_role;
ALTER TABLE public.form_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Knowledge governance can view form profiles" ON public.form_profiles
  FOR SELECT TO authenticated
  USING (public.has_any_knowledge_capability(auth.uid(), ARRAY['knowledge.record.create','knowledge.record.review','knowledge.record.approve','knowledge.record.publish']));

CREATE TABLE public.form_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  knowledge_version_id uuid NOT NULL REFERENCES public.knowledge_record_versions(id) ON DELETE RESTRICT,
  source_version_id uuid REFERENCES public.source_document_versions(id),
  display_file_name text,
  download_allowed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.form_versions TO authenticated;
GRANT ALL ON public.form_versions TO service_role;
ALTER TABLE public.form_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Knowledge governance can view form versions" ON public.form_versions
  FOR SELECT TO authenticated
  USING (public.has_any_knowledge_capability(auth.uid(), ARRAY['knowledge.record.create','knowledge.record.review','knowledge.record.approve','knowledge.record.publish']));

-- download_allowed only for customer-facing forms
CREATE OR REPLACE FUNCTION public.enforce_customer_facing_download()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  cf BOOLEAN;
BEGIN
  IF NEW.download_allowed THEN
    SELECT fp.customer_facing INTO cf
    FROM public.knowledge_record_versions krv
    JOIN public.form_profiles fp ON fp.knowledge_record_id = krv.knowledge_record_id
    WHERE krv.id = NEW.knowledge_version_id;
    IF cf IS NOT TRUE THEN
      RAISE EXCEPTION 'Only approved customer-facing forms may allow download.' USING ERRCODE = 'P0001';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER form_versions_download_rule BEFORE INSERT OR UPDATE ON public.form_versions
  FOR EACH ROW EXECUTE FUNCTION public.enforce_customer_facing_download();

CREATE TABLE public.service_standards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  knowledge_version_id uuid NOT NULL REFERENCES public.knowledge_record_versions(id) ON DELETE RESTRICT,
  category text NOT NULL CHECK (category IN ('Accuracy','Completeness','Probing','Issue Identification','Active Listening','Communication','Politeness','Mechanical Accuracy','KYC/Security','SOP Adherence','Data Capture','Customer Ownership','Self-Service','Documentation','Follow-Up','Approved Verbiage')),
  standard_text text NOT NULL,
  measurement_note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.service_standards TO authenticated;
GRANT ALL ON public.service_standards TO service_role;
ALTER TABLE public.service_standards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Knowledge governance can view service standards" ON public.service_standards
  FOR SELECT TO authenticated
  USING (public.has_any_knowledge_capability(auth.uid(), ARRAY['knowledge.record.create','knowledge.record.review','knowledge.record.approve','knowledge.record.publish']));

-- Version-linked specialised content is frozen once the version is approved.
CREATE OR REPLACE FUNCTION public.block_locked_version_child_mutation()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  st TEXT;
BEGIN
  SELECT workflow_status INTO st FROM public.knowledge_record_versions
   WHERE id = COALESCE(NEW.knowledge_version_id, OLD.knowledge_version_id);
  IF st IN ('APPROVED','PUBLISHED') THEN
    RAISE EXCEPTION 'Content of an approved or published canonical version is immutable. Create a new version.'
      USING ERRCODE = 'P0001';
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;
CREATE TRIGGER procedure_steps_locked BEFORE INSERT OR UPDATE OR DELETE ON public.procedure_steps
  FOR EACH ROW EXECUTE FUNCTION public.block_locked_version_child_mutation();
CREATE TRIGGER product_attributes_locked BEFORE INSERT OR UPDATE OR DELETE ON public.product_attribute_versions
  FOR EACH ROW EXECUTE FUNCTION public.block_locked_version_child_mutation();
CREATE TRIGGER product_availability_locked BEFORE INSERT OR UPDATE OR DELETE ON public.product_availability_periods
  FOR EACH ROW EXECUTE FUNCTION public.block_locked_version_child_mutation();
CREATE TRIGGER form_versions_locked BEFORE INSERT OR UPDATE OR DELETE ON public.form_versions
  FOR EACH ROW EXECUTE FUNCTION public.block_locked_version_child_mutation();
CREATE TRIGGER service_standards_locked BEFORE INSERT OR UPDATE OR DELETE ON public.service_standards
  FOR EACH ROW EXECUTE FUNCTION public.block_locked_version_child_mutation();

-- ---------- PLACEMENT / AUDIENCE FOUNDATION ----------

CREATE TABLE public.platform_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.platform_modules TO authenticated;
GRANT ALL ON public.platform_modules TO service_role;
ALTER TABLE public.platform_modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read module reference data" ON public.platform_modules
  FOR SELECT TO authenticated USING (true);

INSERT INTO public.platform_modules (code, name, sort_order) VALUES
  ('CFC_FOUNDATIONS','CFC Foundations',1),
  ('COMPLAINTS','Complaints',2),
  ('ENQUIRIES','Enquiries',3),
  ('REQUESTS','Requests',4),
  ('PRODUCTS_SERVICES','Products & Services',5),
  ('LOGGING_ESCALATION_GUIDES','Logging & Escalation Guides',6),
  ('FORMS_RESOURCES','Forms & Resources',7),
  ('BO_ENGAGEMENT_DIRECTORIES','BO Engagement & Directories',8);

CREATE TABLE public.module_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform_module_id uuid NOT NULL REFERENCES public.platform_modules(id) ON DELETE RESTRICT,
  code text NOT NULL,
  name text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (platform_module_id, code)
);
GRANT SELECT ON public.module_sections TO authenticated;
GRANT ALL ON public.module_sections TO service_role;
ALTER TABLE public.module_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read module sections" ON public.module_sections
  FOR SELECT TO authenticated USING (true);

CREATE TABLE public.knowledge_placements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  knowledge_version_id uuid NOT NULL REFERENCES public.knowledge_record_versions(id) ON DELETE RESTRICT,
  platform_module_id uuid NOT NULL REFERENCES public.platform_modules(id) ON DELETE RESTRICT,
  module_section_id uuid REFERENCES public.module_sections(id),
  placement_status text NOT NULL DEFAULT 'DRAFT' CHECK (placement_status IN ('DRAFT','ACTIVE','INACTIVE')),
  display_order integer,
  created_by uuid NOT NULL,
  approved_by uuid,
  approved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (knowledge_version_id, platform_module_id, module_section_id)
);
GRANT SELECT ON public.knowledge_placements TO authenticated;
GRANT ALL ON public.knowledge_placements TO service_role;
ALTER TABLE public.knowledge_placements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Knowledge governance can view placements" ON public.knowledge_placements
  FOR SELECT TO authenticated
  USING (public.has_any_knowledge_capability(auth.uid(), ARRAY['knowledge.record.create','knowledge.record.review','knowledge.record.approve','knowledge.record.publish']));
CREATE TRIGGER trg_knowledge_placements_updated BEFORE UPDATE ON public.knowledge_placements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.audience_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  knowledge_placement_id uuid NOT NULL REFERENCES public.knowledge_placements(id) ON DELETE CASCADE,
  country_code text,
  org_unit_id uuid REFERENCES public.organisation_units(id),
  include_descendants boolean NOT NULL DEFAULT true,
  position_id uuid REFERENCES public.positions(id),
  rule_type text NOT NULL DEFAULT 'INCLUDE' CHECK (rule_type IN ('INCLUDE','EXCLUDE')),
  effective_from date,
  effective_to date,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.audience_rules TO authenticated;
GRANT ALL ON public.audience_rules TO service_role;
ALTER TABLE public.audience_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Knowledge governance can view audience rules" ON public.audience_rules
  FOR SELECT TO authenticated
  USING (public.has_any_knowledge_capability(auth.uid(), ARRAY['knowledge.record.create','knowledge.record.review','knowledge.record.approve','knowledge.record.publish']));
