-- Certificates: scope update/delete to owner
CREATE POLICY "Users update own certificates"
ON public.certificates
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own certificates"
ON public.certificates
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Onboarding progress: scope update/delete to owner
CREATE POLICY "Users update own onboarding"
ON public.onboarding_progress
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own onboarding"
ON public.onboarding_progress
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- user_roles: explicitly forbid self-management of roles by authenticated users.
-- Only service_role (which bypasses RLS) may manage roles.
CREATE POLICY "No self role insert"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (false);

CREATE POLICY "No self role update"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (false);

CREATE POLICY "No self role delete"
ON public.user_roles
FOR DELETE
TO authenticated
USING (false);