import GiveawayTab from "@repo/ui/GiveawayTab";
import { GiveawayRequirementsRow } from "@repo/types/giveaway";
import { SetStateAction } from "react";

type GiveawayRequirementsProps = {
  requirements: GiveawayRequirementsRow;
  setCompletedCount: (args_0: SetStateAction<number>) => void;
};

export default function GiveawayRequirements({
  requirements,
  setCompletedCount,
}: GiveawayRequirementsProps) {
  return (
    <div className="flex flex-col gap-10 w-full">
      {requirements.tweet_url && (
        <GiveawayTab
          label="Like"
          link={`https://x.com/intent/like?tweet_id=${
            requirements.tweet_url.split("/")[5]
          }`}
          setCompletedCount={setCompletedCount}
        />
      )}
      {requirements.twitter_url && (
        <GiveawayTab
          label="Follow"
          link={`https://x.com/intent/user?screen_name=${
            requirements.twitter_url.split("https://x.com/")[1]
          }`}
          setCompletedCount={setCompletedCount}
        />
      )}
      {requirements.discord_url && (
        <GiveawayTab
          label="Join Discord"
          link={requirements.discord_url}
          setCompletedCount={setCompletedCount}
        />
      )}
      {requirements.telegram_url && (
        <GiveawayTab
          label="Join Telegram"
          link={requirements.telegram_url}
          setCompletedCount={setCompletedCount}
        />
      )}
      {requirements.dexscreener_url && (
        <GiveawayTab
          label="Visit Dexscreener"
          link={requirements.dexscreener_url}
          setCompletedCount={setCompletedCount}
        />
      )}
      {requirements.pumpdotfun_url && (
        <GiveawayTab
          label="Visit Pump.fun"
          link={requirements.pumpdotfun_url}
          setCompletedCount={setCompletedCount}
        />
      )}
      {requirements.moonshot_url && (
        <GiveawayTab
          label="Visit MoonShot"
          link={requirements.moonshot_url}
          setCompletedCount={setCompletedCount}
        />
      )}
      {requirements.degenpumpfun_url && (
        <GiveawayTab
          label="Visit Degenpumpfun"
          link={requirements.degenpumpfun_url}
          setCompletedCount={setCompletedCount}
        />
      )}
    </div>
  );
}
