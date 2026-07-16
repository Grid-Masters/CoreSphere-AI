-- Approved motivational quote library governed by L&D / Corporate Communications
CREATE TABLE IF NOT EXISTS public.approved_quotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote TEXT NOT NULL,
  author TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  source_module TEXT NOT NULL DEFAULT 'L&D',
  submitted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.approved_quotes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.approved_quotes TO authenticated;
GRANT ALL ON public.approved_quotes TO service_role;

ALTER TABLE public.approved_quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active approved quotes"
  ON public.approved_quotes FOR SELECT
  USING (is_active = true AND approved_at IS NOT NULL);

CREATE POLICY "L&D and admins can insert quote drafts"
  ON public.approved_quotes FOR INSERT
  TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'sysadmin')
    OR public.has_role(auth.uid(), 'ld')
  );

CREATE POLICY "L&D and admins can update quotes"
  ON public.approved_quotes FOR UPDATE
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'sysadmin')
    OR public.has_role(auth.uid(), 'ld')
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'sysadmin')
    OR public.has_role(auth.uid(), 'ld')
  );

CREATE POLICY "Admins can delete quotes"
  ON public.approved_quotes FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'sysadmin'));

CREATE TRIGGER approved_quotes_updated_at
  BEFORE UPDATE ON public.approved_quotes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.approved_quotes (quote, author, category, source_module, approved_at) VALUES
  ('Knowledge shared is service improved.', 'UBA L&D', 'service', 'L&D', now()),
  ('Every customer interaction is an opportunity to strengthen trust.', 'UBA Corporate Communications', 'trust', 'Corporate Communications', now()),
  ('Excellence is not an act, but a habit.', 'Aristotle', 'discipline', 'L&D', now()),
  ('Compliance is not a limit — it is the foundation of trust.', 'UBA Governance', 'compliance', 'Corporate Communications', now()),
  ('Consistency builds trust.', 'UBA L&D', 'discipline', 'L&D', now()),
  ('Great operations are invisible to the customer and unmissable to the business.', 'UBA Operations', 'operations', 'L&D', now()),
  ('Coaching converts capability into performance.', 'UBA QA', 'coaching', 'L&D', now()),
  ('Precision today is reputation tomorrow.', 'UBA L&D', 'quality', 'L&D', now()),
  ('The customer hears your tone before your words.', 'UBA CX', 'service', 'Corporate Communications', now()),
  ('Document the rule. Defend the exception.', 'UBA Governance', 'governance', 'Corporate Communications', now()),
  ('Listen with intent. Respond with care. Resolve with rigor.', 'UBA CX', 'service', 'L&D', now()),
  ('A disciplined team delivers a confident bank.', 'UBA Leadership', 'leadership', 'Corporate Communications', now()),
  ('Standards repeated become culture.', 'UBA L&D', 'culture', 'L&D', now()),
  ('Speed without accuracy is a risk; accuracy without speed is a cost.', 'UBA Operations', 'operations', 'L&D', now()),
  ('Lead the call. Own the outcome.', 'UBA CX', 'leadership', 'Corporate Communications', now());
