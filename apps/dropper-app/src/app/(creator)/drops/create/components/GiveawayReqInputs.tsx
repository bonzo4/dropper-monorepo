import {
  Degen,
  DegenColor,
  Dexscreener,
  DexscreenerColor,
  Discord,
  DiscordColor,
  Moonshot,
  MoonshotColor,
  Pump,
  PumpColor,
  Telegram,
  TelegramColor,
  X,
  XColor,
} from "@repo/ui/Icons";
import Checkbox from "@repo/ui/Checkbox";
import Input from "@repo/ui/Input";
import {
  DEFAULT_GIVEAWAY_REQUIREMENTS,
  GiveawayRequirementsInsert,
} from "@repo/types/giveaway";
import { cn } from "@/lib/utils/classNames";
import { mono } from "@/lib/utils/fonts";
import { ChangeEvent, SetStateAction, useEffect } from "react";

type GiveawayReqInputsOptions = {
  requirements: GiveawayRequirementsInsert;
  setRequirements: (args_0: SetStateAction<GiveawayRequirementsInsert>) => void;
  handleAddRequirements: (
    key: keyof Omit<GiveawayRequirementsInsert, "giveaway_id" | "created_at">
  ) => void;
  handleRequirementsChange: (
    key: keyof Omit<GiveawayRequirementsInsert, "giveaway_id" | "created_at">,
    value: string
  ) => void;
};

export default function GiveawayReqInputs({
  requirements,
  setRequirements,
  handleAddRequirements,
  handleRequirementsChange,
}: GiveawayReqInputsOptions) {
  useEffect(() => {
    const storedGiveaway = localStorage.getItem("requirements");
    if (storedGiveaway) {
      setRequirements({ ...JSON.parse(storedGiveaway) });
    } else {
      setRequirements(DEFAULT_GIVEAWAY_REQUIREMENTS);
    }
  }, [setRequirements]);

  useEffect(() => {
    if (
      JSON.stringify(requirements) !==
      JSON.stringify(DEFAULT_GIVEAWAY_REQUIREMENTS)
    ) {
      localStorage.setItem("requirements", JSON.stringify(requirements));
    }
  }, [setRequirements, requirements]);

  return (
    <div className="flex flex-col gap-6 w-full">
      <h1 className="relative text-2xl md:text-[36px] py-5 ">REQUIREMENTS</h1>
      <div className="flex flex-wrap gap-8 justify-between">
        <button
          type="button"
          className="flex flex-row gap-2 w-[126px] items-center"
          onClick={() => handleAddRequirements("tweet_url")}
        >
          {requirements.tweet_url !== null ? <XColor /> : <X />}
          <span
            className={cn(mono.className, "text-sm w-full")}
            style={{
              color: requirements.tweet_url !== null ? "#00fdd0" : "",
            }}
          >
            Like
          </span>
        </button>
        <button
          type="button"
          className="flex flex-row gap-2 w-[126px] items-center"
          onClick={() => handleAddRequirements("twitter_url")}
        >
          {requirements.twitter_url !== null ? <XColor /> : <X />}
          <span
            className={cn(mono.className, "text-sm w-full")}
            style={{
              color: requirements.twitter_url !== null ? "#00fdd0" : "",
            }}
          >
            Follow
          </span>
        </button>
        <button
          type="button"
          className="flex flex-row gap-2 w-[126px] items-center"
          onClick={() => handleAddRequirements("telegram_url")}
        >
          {requirements.telegram_url !== null ? (
            <TelegramColor />
          ) : (
            <Telegram />
          )}
          <span
            className={cn(mono.className, "text-sm w-full")}
            style={{
              color: requirements.telegram_url !== null ? "#00fdd0" : "",
            }}
          >
            Visit Telegram
          </span>
        </button>
        <button
          type="button"
          className="flex flex-row gap-2 w-[126px] items-center"
          onClick={() => handleAddRequirements("discord_url")}
        >
          {requirements.discord_url !== null ? <DiscordColor /> : <Discord />}
          <span
            className={cn(mono.className, "text-sm w-full")}
            style={{
              color: requirements.discord_url !== null ? "#00fdd0" : "",
            }}
          >
            Visit Discord
          </span>
        </button>
        <button
          type="button"
          className="flex flex-row gap-2 w-[126px] items-center"
          onClick={() => handleAddRequirements("dexscreener_url")}
        >
          {requirements.dexscreener_url !== null ? (
            <DexscreenerColor />
          ) : (
            <Dexscreener />
          )}
          <span
            className={cn(mono.className, "text-sm w-full")}
            style={{
              color: requirements.dexscreener_url !== null ? "#00fdd0" : "",
            }}
          >
            Visit Dexscreener
          </span>
        </button>
        <button
          type="button"
          className="flex flex-row gap-2 w-[126px] items-center"
          onClick={() => handleAddRequirements("pumpdotfun_url")}
        >
          {requirements.pumpdotfun_url !== null ? <PumpColor /> : <Pump />}
          <span
            className={cn(mono.className, "text-sm w-full")}
            style={{
              color: requirements.pumpdotfun_url !== null ? "#00fdd0" : "",
            }}
          >
            Visit Pumpdotfun
          </span>
        </button>
        <button
          type="button"
          className="flex flex-row gap-2 w-[126px] items-center"
          onClick={() => handleAddRequirements("moonshot_url")}
        >
          {requirements.moonshot_url !== null ? (
            <MoonshotColor />
          ) : (
            <Moonshot />
          )}
          <span
            className={cn(mono.className, "text-sm w-full")}
            style={{
              color: requirements.moonshot_url !== null ? "#00fdd0" : "",
            }}
          >
            Visit Moonshot
          </span>
        </button>
        <button
          type="button"
          className="flex flex-row gap-2 w-[126px] items-center"
          onClick={() => handleAddRequirements("degenpumpfun_url")}
        >
          {requirements.degenpumpfun_url !== null ? <DegenColor /> : <Degen />}
          <span
            className={cn(mono.className, "text-sm w-full")}
            style={{
              color: requirements.degenpumpfun_url !== null ? "#00fdd0" : "",
            }}
          >
            Visit Degenpumpfun
          </span>
        </button>
      </div>
      <div className="flex lg:flex-row gap-2 flex-col w-full">
        <div className="flex flex-col gap-2 grow">
          <Input
            disabled={requirements.tweet_url === null}
            placeholder="Post URL"
            className="w-full"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleRequirementsChange("tweet_url", e.target.value)
            }
            value={requirements.tweet_url ? requirements.tweet_url : ""}
          />
          <Input
            disabled={requirements.twitter_url === null}
            placeholder="X URL"
            className="w-full"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleRequirementsChange("twitter_url", e.target.value)
            }
            value={requirements.twitter_url ? requirements.twitter_url : ""}
          />
          <Input
            disabled={requirements.telegram_url === null}
            placeholder="Telegram Link"
            className="w-full"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleRequirementsChange("telegram_url", e.target.value)
            }
            value={requirements.telegram_url ? requirements.telegram_url : ""}
          />
          <Input
            disabled={requirements.discord_url === null}
            placeholder="Discord Invite"
            className="w-full"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleRequirementsChange("discord_url", e.target.value)
            }
            value={requirements.discord_url ? requirements.discord_url : ""}
          />
        </div>
        <div className="flex flex-col gap-2 grow">
          <Input
            disabled={requirements.dexscreener_url === null}
            placeholder="Dexscreener URL"
            className="w-full"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleRequirementsChange("dexscreener_url", e.target.value)
            }
            value={
              requirements.dexscreener_url ? requirements.dexscreener_url : ""
            }
          />
          <Input
            disabled={requirements.pumpdotfun_url === null}
            placeholder="Pumpdotfun URL"
            className="w-full"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleRequirementsChange("pumpdotfun_url", e.target.value)
            }
            value={
              requirements.pumpdotfun_url ? requirements.pumpdotfun_url : ""
            }
          />
          <Input
            disabled={requirements.moonshot_url === null}
            placeholder="Moonshot URL"
            className="w-full"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleRequirementsChange("moonshot_url", e.target.value)
            }
            value={requirements.moonshot_url ? requirements.moonshot_url : ""}
          />
          <Input
            disabled={requirements.degenpumpfun_url === null}
            placeholder="Degenpumpfun URL"
            className="w-full"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleRequirementsChange("degenpumpfun_url", e.target.value)
            }
            value={
              requirements.degenpumpfun_url ? requirements.degenpumpfun_url : ""
            }
          />
        </div>
      </div>
    </div>
  );
}
