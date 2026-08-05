CREATE POLICY "Identity managers view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  (SELECT auth.uid()) IS NOT NULL
  AND public.has_capability((SELECT auth.uid()), 'platform.identity.manage')
);