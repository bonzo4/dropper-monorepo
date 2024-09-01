import { DatabaseTypes } from "@repo/types/database";

export type DropmanRow = DatabaseTypes["public"]["Tables"]["dropmans"]["Row"];

export type DropmanView =
  DatabaseTypes["public"]["Views"]["dropmans_view"]["Row"];
