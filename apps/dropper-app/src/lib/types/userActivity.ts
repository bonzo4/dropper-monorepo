import { DatabaseTypes } from "@repo/app-types/database";

export type UserActivity =
  DatabaseTypes["public"]["Tables"]["user_activities"]["Row"];
