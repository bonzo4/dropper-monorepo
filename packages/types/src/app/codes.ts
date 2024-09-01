import { DatabaseTypes } from "@repo/types/database";

export type AccessCodeRow =
  DatabaseTypes["public"]["Tables"]["access_codes"]["Row"];

export type UserCodeRow =
  DatabaseTypes["public"]["Tables"]["user_codes"]["Row"];
