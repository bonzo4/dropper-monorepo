"use client";
import { Paragraph } from "@repo/ui";
import { numString } from "@/lib/utils/numString";
import Image from "next/image";
import Link from "next/link";
import Countdown from "react-countdown";
import { cn } from "@repo/ui/utils";
import { mono } from "@repo/ui/utils";
import {
  BaseBadge,
  BNBBadge,
  CTOBadge,
  GoldBadge,
  MaticBadge,
  MoonBadge,
  PumpFunBadge,
  SolBadge,
  TrendingBadge,
} from "@repo/ui/badges";
import { LandingGiveaway } from "@/lib/data/giveaway/getGiveaways";

type GiveawayCardProps = {
  giveaway: LandingGiveaway;
};

const GiveawayCard = ({ giveaway }: GiveawayCardProps) => {
  const renderer = ({ days, hours, minutes, seconds, completed }: any) => {
    const dayHours = days * 24;
    hours = hours + dayHours;
    if (completed) {
      // Render a completed state
      return (
        <span className={cn(mono.className, "text-primary font-semibold")}>
          00:00:00
        </span>
      );
    } else {
      return (
        <span
          className={cn(mono.className, "text-primary font-semibold")}
          suppressHydrationWarning={true}
          style={{
            color:
              hours === 0 && minutes <= 9
                ? "#ff2e2f"
                : hours === 0 && minutes <= 29
                  ? "#ff822e"
                  : hours === 0 && minutes <= 49
                    ? "#ffcb2e"
                    : undefined,
          }}
        >
          {hours < 10 ? `0${hours}` : hours}:
          {minutes < 10 ? `0${minutes}` : minutes}:
          {seconds < 10 ? `0${seconds}` : seconds}
        </span>
      );
    }
  };

  return (
    <Link href={`/drops/${giveaway.id}`}>
      <div className="flex flex-col bg-secondary border-[2px] rounded-md border-primary hover:cursor-pointer hover:bg-black p-4 gap-3">
        <div className="flex flex-row items-stretch gap-[8px]">
          <div className="w-[63px] h-[63px] overflow-hidden rounded-md flex items-center justify-center">
            <Image
              src={giveaway.icon_url}
              alt={giveaway.title}
              width={63}
              height={63}
              className="w-auto h-auto"
            />
          </div>
          <div className="flex flex-col justify-end gap-2">
            {giveaway.badges.length > 0 && (
              <div className="flex flex-row gap-1">
                {giveaway.badges
                  .sort(() => Math.random() - 0.5)
                  .slice(0, 6)
                  .map((badge) =>
                    badge === "BASE" ? (
                      <BaseBadge key={badge} />
                    ) : badge === "BNB" ? (
                      <BNBBadge key={badge} />
                    ) : badge === "GOLD" ? (
                      <GoldBadge key={badge} />
                    ) : badge === "MATIC" ? (
                      <MaticBadge key={badge} />
                    ) : badge === "MOON" ? (
                      <MoonBadge key={badge} />
                    ) : badge === "PUMP_FUN" ? (
                      <PumpFunBadge key={badge} />
                    ) : badge === "SOL" ? (
                      <SolBadge key={badge} />
                    ) : badge === "TRENDING" ? (
                      <TrendingBadge key={badge} />
                    ) : badge === "CTO" ? (
                      <CTOBadge key={badge} />
                    ) : null
                  )}
              </div>
            )}
            <h3 className="relative text-[26px] md:text-[28px] truncate w-[160px] -mt-2">
              ${giveaway.ticker.replaceAll("$", "").toUpperCase().slice(0, 8)}
            </h3>
          </div>
        </div>
        <Paragraph className="w-[221px] h-[80px] text-[14px]">
          {giveaway.title} : {giveaway.description}
        </Paragraph>
        <div className="flex flex-row gap-4">
          <div className="flex flex-col items-start justify-center">
            <span className="relative text-[14px] tracking-widest">
              Reward 🔥
            </span>
            <Paragraph className="relative text-[16px] text-primary font-semibold">
              {numString(giveaway.reward_amount)} $
              {giveaway.token_address ===
              "So11111111111111111111111111111111111111112"
                ? "SOL"
                : `${giveaway.ticker.replaceAll("$", "").toUpperCase().slice(0, 8)}`}
            </Paragraph>
          </div>
          <div className="flex flex-col items-start justify-center">
            <span className="relative text-[14px] tracking-widest">
              USD VAL.
            </span>
            <Paragraph className="relative text-[16px] text-primary font-semibold">
              ${numString(giveaway.usd_value)}
            </Paragraph>
          </div>
        </div>
        <Paragraph className="text-[14px]">
          Entries: {giveaway.entries}
        </Paragraph>
        <div className="flex flex-row justify-between p-[7px] border-[2px] border-primary rounded-md">
          <span className="flex flex-row gap-1 relative text-[14px] tracking-widest">
            DROP ENDS IN
          </span>
          <Countdown date={giveaway.end_time} renderer={renderer} />
        </div>
      </div>
    </Link>
  );
};

export default GiveawayCard;
