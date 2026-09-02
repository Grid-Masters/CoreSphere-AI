
REVOKE ALL ON FUNCTION public.enforce_knowledge_version_immutability() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.block_source_version_mutation() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.block_locked_evidence_link_mutation() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.block_locked_version_child_mutation() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.enforce_customer_facing_download() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.has_any_knowledge_capability(uuid, text[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_any_knowledge_capability(uuid, text[]) TO authenticated;
