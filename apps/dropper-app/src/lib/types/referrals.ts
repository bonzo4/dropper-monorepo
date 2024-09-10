import { DatabaseTypes } from "@repo/app-types/database";

export type DirectReferrals =
  DatabaseTypes["public"]["Tables"]["direct_referrals"]["Row"];
export type SecondaryReferrals =
  DatabaseTypes["public"]["Tables"]["secondary_referrals"]["Row"];
export type TertiaryReferrals =
  DatabaseTypes["public"]["Tables"]["tertiary_referrals"]["Row"];
