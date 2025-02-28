import { DatabaseTypes } from "@repo/app-types/database";

export type AirdropRow = DatabaseTypes["public"]["Tables"]["airdrops"]["Row"];

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
