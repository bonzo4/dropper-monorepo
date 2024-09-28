import {
  GiveawayInsert,
  GiveawayRequirementsInsert,
} from "@/lib/types/giveaway";

export function checkGiveaway(
  giveaway: GiveawayInsert,
  giveawayType: "solana" | "spl"
) {
  if (!giveaway.title) throw new Error("Title is required");
  if (!giveaway.icon_url) throw new Error("Icon is required");
  if (!giveaway.ticker) throw new Error("Ticker is required");
  if (!giveaway.description) throw new Error("Description is required");
  if (!giveaway.reward_amount) throw new Error("Reward amount is required");
  if (giveawayType === "spl" && !giveaway.token_address)
    throw new Error("Token address is required");
  if (
    giveawayType === "solana" &&
    ![0.1, 0.25, 0.5].includes(giveaway.reward_amount)
  ) {
    throw new Error("Reward amount must be 0.1, 0.25, or 0.5");
  }
  const now = new Date();
  const dayFromNow = new Date(now);
  dayFromNow.setDate(now.getDate() + 1);
  if (!giveaway.end_time && new Date(giveaway.end_time).valueOf() < Date.now())
    throw new Error("End time must be in the future");
  if (!giveaway.winner_amount) throw new Error("Winner count is required");
}

export function checkGiveawayRequirements(
  requirements: GiveawayRequirementsInsert
) {
  if (
    requirements.twitter_url &&
    !requirements.twitter_url.startsWith("https://x.com/")
  )
    throw new Error("Please enter a valid twitter url");
  if (
    requirements.tweet_url &&
    !requirements.tweet_url.startsWith("https://x.com/") &&
    !requirements.tweet_url.includes("status")
  )
    throw new Error("Please enter a valid tweet url");
  if (
    requirements.discord_url &&
    !requirements.discord_url.startsWith("https://discord.")
  )
    throw new Error("Please enter a valid discord url");
  if (
    requirements.telegram_url &&
    !requirements.telegram_url.startsWith("https://t.me/")
  )
    throw new Error("Please enter a valid telegram url");
  if (
    requirements.moontok_url &&
    !requirements.moontok_url.startsWith("https://moontok.io/coins/")
  )
    throw new Error("Please enter a valid moontok.io url");

  if (
    requirements.dexscreener_url &&
    !requirements.dexscreener_url.startsWith("https://dexscreener.com/")
  )
    throw new Error("Please enter a valid dexscreener url");
  if (
    requirements.moonshot_url &&
    !requirements.moonshot_url.startsWith("https://dexscreener.com/moonshot/")
  )
    throw new Error("Please enter a valid moonshot url");
  if (
    requirements.pumpdotfun_url &&
    !requirements.pumpdotfun_url.startsWith("https://pump.fun/")
  )
    throw new Error("Please enter a valid pumpdotfun url");
}
