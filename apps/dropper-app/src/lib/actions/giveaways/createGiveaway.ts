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
  const requirmentsInsert = JSON.parse(
    requirements
  ) as GiveawayRequirementsInsert;
  if (giveawayType === "solana") {
    delete giveawayInsert.token_address;
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
  //   now.setMinutes(now.getMinutes() + 1);
  now.setSeconds(0, 0);
  const startDateMs = now.getTime();
  const { data, error } = await supabase
    .from("giveaways")
    .insert({
      ...giveawayInsert,
      start_time: new Date(startDateMs).toISOString(),
      end_time: giveawayInsert.end_time,
      creator_key: creatorKey,
      badges: ctoListing ? [...badges, "CTO"] : badges,
      user_id: user.id,
    })
    .select("id")
    .single();

  if (error) return JSON.stringify({ status: "error", error: error.message });

  const { error: error2 } = await supabase
    .from("giveaway_requirements")
    .insert({ ...requirmentsInsert, giveaway_id: data.id });

  if (error2) return JSON.stringify({ status: "error", error: error2.message });

  return JSON.stringify({
    status: "ok",
    giveawayId: data.id,
  });
}
