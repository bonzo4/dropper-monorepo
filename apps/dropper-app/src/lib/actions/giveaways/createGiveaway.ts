"use server";
import { createSupabaseServer } from "../../supabase/server";
import { GiveawayBadges } from "../../types/enums";
import {
  GiveawayInsert,
  GiveawayRequirementsInsert,
} from "../../types/giveaway";
import { getRugScore } from "../getRugScore";
import { getTokenPrice } from "../getTokenPrice";

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
  const supabase = createSupabaseServer();

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
    const rugResponse = await getRugScore();

    if (rugResponse.status === "error") {
      return JSON.stringify(rugResponse);
    }
    giveawayInsert.rug_score = rugResponse;

    const priceResponse = await getTokenPrice();

    if (priceResponse.status === "error") {
      return JSON.stringify(priceResponse);
    }
    giveawayInsert.usd_value = priceResponse * giveawayInsert.reward_amount;
  }
  const now = new Date();
  //   now.setMinutes(now.getMinutes() + 1);
  now.setSeconds(0, 0);
  const startDateMs = now.getTime();
  const endDateMs = startDateMs + 1000 * 60 * 5;
  const { data, error } = await supabase
    .from("giveaways")
    .insert({
      ...giveawayInsert,
      id: 113,
      start_time: new Date(startDateMs).toISOString(),
      end_time: new Date(endDateMs).toISOString(),
      creator_key: creatorKey,
      badges,
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
