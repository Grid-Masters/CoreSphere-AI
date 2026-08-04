/**
 * Identity access points. The authority is the database-backed
 * IdentityProvider (see src/components/identity/IdentityProvider.tsx);
 * the static directory is demo/fixture metadata only.
 */
export {
  useActiveUser,
  useIdentity,
  getActiveUserSnapshot as getActiveUser,
} from "@/components/identity/IdentityProvider";
export type { ActiveUser, IdentityState, PositionCode } from "@/lib/identity";
