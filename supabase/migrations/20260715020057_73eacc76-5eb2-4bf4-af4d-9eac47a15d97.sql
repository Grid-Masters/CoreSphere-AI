-- Recreate enforce_single_active_team as SECURITY INVOKER
CREATE OR REPLACE FUNCTION public.enforce_single_active_team()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  existing_team_name TEXT;
  existing_lead_name TEXT;
BEGIN
  IF NEW.is_active THEN
    SELECT t.name, COALESCE(p.full_name, 'Unknown')
      INTO existing_team_name, existing_lead_name
    FROM public.team_members tm
    JOIN public.teams t ON t.id = tm.team_id
    LEFT JOIN public.profiles p ON p.id = t.team_lead_id
    WHERE tm.user_id = NEW.user_id
      AND tm.is_active = true
      AND tm.id <> COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
    LIMIT 1;

    IF existing_team_name IS NOT NULL THEN
      RAISE EXCEPTION USING
        MESSAGE = 'This employee is currently assigned to Team ''' || existing_team_name ||
                  ''' under Team Lead ''' || existing_lead_name ||
                  '''. Please remove the employee from the current team before assigning them to another.',
        ERRCODE = 'P0001';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.enforce_single_active_team() FROM PUBLIC, anon, authenticated;

-- block_audit_mutation: set search_path and revoke direct execution
CREATE OR REPLACE FUNCTION public.block_audit_mutation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  RAISE EXCEPTION 'audit_events is append-only; % is not permitted', TG_OP
    USING ERRCODE = 'P0001';
END;
$$;

REVOKE EXECUTE ON FUNCTION public.block_audit_mutation() FROM PUBLIC, anon, authenticated;
