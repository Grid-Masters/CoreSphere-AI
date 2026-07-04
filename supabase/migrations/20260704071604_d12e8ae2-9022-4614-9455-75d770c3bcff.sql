CREATE TABLE public.suggestions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category text NOT NULL DEFAULT 'General',
  body text NOT NULL,
  status text NOT NULL DEFAULT 'Submitted',
  ai_category text,
  ai_summary text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.suggestions TO authenticated;
GRANT ALL ON public.suggestions TO service_role;

ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authors read own suggestions"
ON public.suggestions FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Management reads all suggestions"
ON public.suggestions FOR SELECT TO authenticated
USING (
  public.has_role(auth.uid(), 'team_lead')
  OR public.has_role(auth.uid(), 'ld')
  OR public.has_role(auth.uid(), 'group_head')
);

CREATE POLICY "Authors insert own suggestions"
ON public.suggestions FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authors update own suggestions"
ON public.suggestions FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Management updates suggestions"
ON public.suggestions FOR UPDATE TO authenticated
USING (
  public.has_role(auth.uid(), 'team_lead')
  OR public.has_role(auth.uid(), 'ld')
  OR public.has_role(auth.uid(), 'group_head')
);

CREATE TRIGGER update_suggestions_updated_at
BEFORE UPDATE ON public.suggestions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();