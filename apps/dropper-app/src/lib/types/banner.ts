import { Database } from "@/lib/supabase/types";

export type BannerRow = Database["public"]["Tables"]["banners"]["Row"];

export type GiveawayBannerRow =
  Database["public"]["Tables"]["giveaway_banners"]["Row"];
