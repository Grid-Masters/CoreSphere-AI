
-- Tighten failed_searches insert (must match own user or be anonymous)
DROP POLICY IF EXISTS "Authenticated insert failed search" ON public.failed_searches;
CREATE POLICY "Authenticated insert own failed search" ON public.failed_searches
  FOR INSERT TO authenticated
  WITH CHECK (user_id IS NULL OR auth.uid() = user_id);

-- Restrict SECURITY DEFINER function execution
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.update_updated_at_column() TO authenticated;
