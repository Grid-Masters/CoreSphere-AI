-- CoreSphere AI hierarchy and pre-production foundation alignment.
-- This migration is additive and does not publish the application.

DO $$
DECLARE
  operations_id uuid;
BEGIN
  SELECT id INTO operations_id
  FROM public.organisation_units
  WHERE code = 'CFC-OPERATIONS';

  IF operations_id IS NULL THEN
    RAISE EXCEPTION 'CFC-OPERATIONS organisation unit is required before hierarchy alignment';
  END IF;

  INSERT INTO public.organisation_units (
    code, name, display_name, unit_type, parent_unit_id, country_code,
    is_active, effective_from, effective_to, metadata
  ) VALUES
    (
      'CFC-QA',
      'Quality Assurance Team (Q.A)',
      'Quality Assurance Team (Q.A)',
      'DEPARTMENT',
      operations_id,
      'NG',
      true,
      CURRENT_DATE,
      NULL,
      jsonb_build_object('reporting_family', 'QA')
    ),
    (
      'CFC-LD',
      'Learning and Development Team (L & D)',
      'Learning and Development Team (L & D)',
      'DEPARTMENT',
      operations_id,
      'NG',
      true,
      CURRENT_DATE,
      NULL,
      jsonb_build_object('reporting_family', 'LD')
    )
  ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    display_name = EXCLUDED.display_name,
    unit_type = EXCLUDED.unit_type,
    parent_unit_id = EXCLUDED.parent_unit_id,
    is_active = true,
    effective_to = NULL,
    metadata = COALESCE(public.organisation_units.metadata, '{}'::jsonb) || EXCLUDED.metadata,
    updated_at = now();
END
$$;

CREATE TABLE IF NOT EXISTS public.position_reporting_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_position_id uuid NOT NULL REFERENCES public.positions(id) ON DELETE RESTRICT,
  manager_position_id uuid REFERENCES public.positions(id) ON DELETE RESTRICT,
  reporting_tier smallint NOT NULL CHECK (reporting_tier BETWEEN 1 AND 5),
  reporting_family text NOT NULL CHECK (reporting_family IN ('EXECUTIVE','OPERATIONS','QA','LD')),
  is_active boolean NOT NULL DEFAULT true,
  effective_from date NOT NULL DEFAULT CURRENT_DATE,
  effective_to date,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT position_reporting_rules_period_check
    CHECK (effective_to IS NULL OR effective_to >= effective_from),
  CONSTRAINT position_reporting_rules_manager_check
    CHECK (
      (reporting_tier = 1 AND manager_position_id IS NULL)
      OR (reporting_tier > 1 AND manager_position_id IS NOT NULL)
    ),
  CONSTRAINT position_reporting_rules_no_self_manager
    CHECK (manager_position_id IS NULL OR child_position_id <> manager_position_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS position_reporting_rules_one_current_rule
  ON public.position_reporting_rules (child_position_id)
  WHERE is_active AND effective_to IS NULL;
CREATE INDEX IF NOT EXISTS position_reporting_rules_manager_idx
  ON public.position_reporting_rules (manager_position_id)
  WHERE is_active;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.position_reporting_rules TO authenticated;
GRANT ALL ON public.position_reporting_rules TO service_role;
ALTER TABLE public.position_reporting_rules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Reporting rules readable by authenticated users" ON public.position_reporting_rules;
CREATE POLICY "Reporting rules readable by authenticated users"
  ON public.position_reporting_rules FOR SELECT TO authenticated
  USING (is_active AND effective_from <= CURRENT_DATE AND (effective_to IS NULL OR effective_to >= CURRENT_DATE));

DROP POLICY IF EXISTS "Organisation managers configure reporting rules" ON public.position_reporting_rules;
CREATE POLICY "Organisation managers configure reporting rules"
  ON public.position_reporting_rules FOR ALL TO authenticated
  USING (public.has_capability(auth.uid(), 'platform.organisation.manage'))
  WITH CHECK (public.has_capability(auth.uid(), 'platform.organisation.manage'));

DROP TRIGGER IF EXISTS trg_position_reporting_rules_updated ON public.position_reporting_rules;
CREATE TRIGGER trg_position_reporting_rules_updated
  BEFORE UPDATE ON public.position_reporting_rules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

WITH desired(child_code, manager_code, reporting_tier, reporting_family) AS (
  VALUES
    ('GROUP_HEAD', NULL::text, 1, 'EXECUTIVE'),
    ('HEAD_CFC_OPERATIONS', 'GROUP_HEAD', 2, 'EXECUTIVE'),
    ('UNIT_HEAD', 'HEAD_CFC_OPERATIONS', 3, 'OPERATIONS'),
    ('QA_UNIT_HEAD', 'HEAD_CFC_OPERATIONS', 3, 'QA'),
    ('LD_UNIT_HEAD', 'HEAD_CFC_OPERATIONS', 3, 'LD'),
    ('TEAM_LEAD', 'UNIT_HEAD', 4, 'OPERATIONS'),
    ('QA_TEAM_LEAD', 'QA_UNIT_HEAD', 4, 'QA'),
    ('LD_TEAM_LEAD', 'LD_UNIT_HEAD', 4, 'LD'),
    ('CEE', 'TEAM_LEAD', 5, 'OPERATIONS'),
    ('QA_OFFICER', 'QA_TEAM_LEAD', 5, 'QA'),
    ('LD_OFFICER', 'LD_TEAM_LEAD', 5, 'LD')
)
INSERT INTO public.position_reporting_rules (
  child_position_id, manager_position_id, reporting_tier, reporting_family, metadata
)
SELECT child.id, manager.id, desired.reporting_tier, desired.reporting_family,
       jsonb_build_object('source', 'locked_operational_hierarchy')
FROM desired
JOIN public.positions child ON child.code = desired.child_code
LEFT JOIN public.positions manager ON manager.code = desired.manager_code
WHERE (desired.manager_code IS NULL OR manager.id IS NOT NULL)
  AND NOT EXISTS (
    SELECT 1
    FROM public.position_reporting_rules existing
    WHERE existing.child_position_id = child.id
      AND existing.is_active
      AND existing.effective_to IS NULL
  );

-- Align only the known development/demo identities. Real employee reporting
-- assignments remain individually configurable and are never inferred by name.
WITH desired_links(child_user_id, manager_user_id) AS (
  VALUES
    ('f6c1320b-0f86-4355-923c-e8e3a912dba5'::uuid, '0783db76-df4a-4824-8355-7affdbcebcba'::uuid),
    ('ff173534-09f9-4dfe-8e10-4f61f3f2a590'::uuid, '0783db76-df4a-4824-8355-7affdbcebcba'::uuid),
    ('6603349c-036f-4642-8959-15820f90a59c'::uuid, '0783db76-df4a-4824-8355-7affdbcebcba'::uuid),
    ('0783db76-df4a-4824-8355-7affdbcebcba'::uuid, '500a4ae4-d235-413a-b1c0-a28e8dd7707f'::uuid),
    ('500a4ae4-d235-413a-b1c0-a28e8dd7707f'::uuid, 'ca0d3571-1a8f-49a2-a1bd-5858563325d7'::uuid),
    ('4162ba13-0324-47bf-92e3-8aaec8aca50c'::uuid, 'f2f19732-d516-47fd-abe3-376ab99722ec'::uuid),
    ('6b90b3ff-ae62-414b-ae64-4e5fedabbbd7'::uuid, 'f2f19732-d516-47fd-abe3-376ab99722ec'::uuid),
    ('f2f19732-d516-47fd-abe3-376ab99722ec'::uuid, 'ba892106-3d29-4be3-afd0-c0fc9e88e3b9'::uuid),
    ('ba892106-3d29-4be3-afd0-c0fc9e88e3b9'::uuid, 'ca0d3571-1a8f-49a2-a1bd-5858563325d7'::uuid),
    ('089b0529-263d-40b1-8951-f195211614d1'::uuid, '60cb3b58-756e-4c3b-9a2b-ab7093b6447a'::uuid),
    ('60cb3b58-756e-4c3b-9a2b-ab7093b6447a'::uuid, '6de07f2a-4d72-4f98-915f-f193a7f04878'::uuid),
    ('6de07f2a-4d72-4f98-915f-f193a7f04878'::uuid, 'ca0d3571-1a8f-49a2-a1bd-5858563325d7'::uuid),
    ('ca0d3571-1a8f-49a2-a1bd-5858563325d7'::uuid, '33ff2e2b-c1fd-413f-9e33-5b9c870c0a34'::uuid)
), current_assignments AS (
  SELECT id, user_id
  FROM public.position_assignments
  WHERE is_primary
    AND status = 'ACTIVE'
    AND effective_from <= CURRENT_DATE
    AND (effective_to IS NULL OR effective_to >= CURRENT_DATE)
)
UPDATE public.position_assignments child
SET reports_to_assignment_id = manager.id,
    updated_at = now()
FROM desired_links link
JOIN current_assignments manager ON manager.user_id = link.manager_user_id
WHERE child.user_id = link.child_user_id
  AND child.is_primary
  AND child.status = 'ACTIVE'
  AND child.effective_from <= CURRENT_DATE
  AND (child.effective_to IS NULL OR child.effective_to >= CURRENT_DATE);
