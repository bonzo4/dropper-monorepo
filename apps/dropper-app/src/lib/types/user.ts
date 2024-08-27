import { Database } from "../supabase/types";

export type DropmanRow = Database["public"]["Tables"]["dropmans"]["Row"];

export type DropmanView = Database["public"]["Views"]["dropmans_view"]["Row"];
