"use server";
import { createSupabaseServer } from "@repo/lib/supabase";
import { GiveawayBadges } from "../../types/enums";
import {
  GiveawayInsert,
  GiveawayRequirementsInsert,
} from "../../types/giveaway";
import { getRugScore } from "../../data/getRugScore";
import { getTokenPrice } from "../../data/getTokenPrice";
import { ListingRow } from "@/lib/types/listing";

type CreateGiveawayOptions = {
  giveaway: string;
  requirements: string;
  giveawayType: "solana" | "spl";
  creatorKey: string;
  badges: GiveawayBadges[];
};

export async function createGiveaway({
  giveaway,
  giveawayType,
  creatorKey,
  requirements,
  badges,
}: CreateGiveawayOptions) {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return JSON.stringify({
      status: "error",
      error: "Please login to create a giveaway",
    });

  const giveawayInsert = JSON.parse(giveaway) as GiveawayInsert;
  const requirementsInsert = JSON.parse(
    requirements
  ) as GiveawayRequirementsInsert;
  if (giveawayType === "solana") {
    giveawayInsert.token_address =
      "So11111111111111111111111111111111111111112";
    const priceResponse = await getTokenPrice(giveawayInsert.token_address);

    if (priceResponse.status === "error") {
      return JSON.stringify(priceResponse);
    }
    giveawayInsert.usd_value = priceResponse * giveawayInsert.reward_amount;
  }
  if (giveawayType === "spl" && giveawayInsert.token_address) {
    const rugResponse = await getRugScore(giveawayInsert.token_address);

    if (rugResponse.status === "error") {
      return JSON.stringify(rugResponse);
    }

    if (typeof rugResponse == "number" && rugResponse > 30000) {
      return JSON.stringify({
        status: "error",
        error: "This token has a high rug score",
      });
    }

    giveawayInsert.rug_score = rugResponse;

    const priceResponse = await getTokenPrice(giveawayInsert.token_address);

    if (priceResponse.status === "error") {
      return JSON.stringify(priceResponse);
    }
    giveawayInsert.usd_value = priceResponse * giveawayInsert.reward_amount;
  }

  let ctoListing: { id: number } | null = null;
  if (giveawayInsert.token_address) {
    const { data: listing } = await supabase
      .from("listings")
      .select("id")
      .eq("token_address", giveawayInsert.token_address)
      .eq("is_cto", true)
      .single();

    ctoListing = listing;
  }

  const now = new Date();
  now.setMinutes(now.getMinutes() + 5);
  const startDateMs = now.getTime();
  const endDateMs =
    giveawayInsert.end_time === "24"
      ? new Date(now).setHours(now.getHours() + 24)
      : giveawayInsert.end_time === "12"
        ? new Date(now).setHours(now.getHours() + 12)
        : giveawayInsert.end_time === "6"
          ? new Date(now).setHours(now.getHours() + 6)
          : giveawayInsert.end_time === "2"
            ? new Date(now).setHours(now.getHours() + 2)
            : new Date(now).setHours(now.getHours() + 1);
  const { data, error } = await supabase
    .from("giveaways")
    .insert({
      ...giveawayInsert,
      start_time: new Date(startDateMs).toISOString(),
      end_time: new Date(endDateMs).toISOString(),
      creator_key: creatorKey,
      badges: ctoListing ? [...badges, "CTO"] : badges,
      user_id: user.id,
      ticker: giveawayInsert.ticker.replaceAll("$", "").toUpperCase(),
    })
    .select("id")
    .single();

  if (error) return JSON.stringify({ status: "error", error: error.message });

  const { error: error2 } = await supabase
    .from("giveaway_requirements")
    .insert({ ...requirementsInsert, giveaway_id: data.id });

  if (error2) return JSON.stringify({ status: "error", error: error2.message });

  return JSON.stringify({
    status: "ok",
    giveawayId: data.id,
  });
}
