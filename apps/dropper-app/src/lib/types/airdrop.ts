import { Database } from "../supabase/types";

export type AirdropRow = Database["public"]["Tables"]["airdrops"]["Row"];

export type AirdropPreviewItem = Pick<
  AirdropRow,
  | "id"
  | "title"
  | "symbol"
  | "description"
  | "icon_url"
  | "questers"
  | "likelihood"
  | "blockchain"
  | "est_airdrop_size"
  | "blockchain"
  | "category"
  | "sentiment"
  | "slug"
>;
