import { DatabaseTypes } from "@repo/app-types/database";

export type DiscordAccount =
  DatabaseTypes["public"]["Tables"]["discord_accounts"]["Row"];

export type SolanaWallet =
  DatabaseTypes["public"]["Tables"]["solana_wallets"]["Row"];
