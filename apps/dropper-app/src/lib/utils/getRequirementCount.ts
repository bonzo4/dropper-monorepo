import { GiveawayRequirementsRow } from "../types/giveaway";

export function getRequirementCount(
  requirements: GiveawayRequirementsRow | null
) {
  if (!requirements) return 0;
  let count = 0;
  if (requirements.degenpumpfun_url) count++;
  if (requirements.dexscreener_url) count++;
  if (requirements.discord_url) count++;
  if (requirements.moonshot_url) count++;
  if (requirements.pumpdotfun_url) count++;
  if (requirements.telegram_url) count++;
  if (requirements.tweet_url) count++;
  if (requirements.twitter_url) count++;
  return count;
}
