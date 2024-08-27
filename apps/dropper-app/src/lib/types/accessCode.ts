import { Database } from "../supabase/types";

export type AccessCodeRow = Database["public"]["Tables"]["access_codes"]["Row"];

export type UserCodeRow = Database["public"]["Tables"]["user_codes"]["Row"];
