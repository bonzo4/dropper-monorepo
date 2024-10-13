import { DatabaseTypes } from "@repo/app-types/database";

export type DiscordAccount =
  DatabaseTypes["public"]["Tables"]["discord_accounts"]["Row"];

export type TwitterAccount =
  DatabaseTypes["public"]["Tables"]["twitter_accounts"]["Row"];

export type SolanaWallet =
  DatabaseTypes["public"]["Tables"]["solana_wallets"]["Row"];

export type TelegramAccount =
  DatabaseTypes["public"]["Tables"]["telegram_accounts"]["Row"];
