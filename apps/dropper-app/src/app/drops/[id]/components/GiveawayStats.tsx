"use client";
import { GiveawayRow } from "@/lib/types/giveaway";
import { AirdropPageRow } from "@/lib/types/sections";
import { cn } from "@repo/ui/utils";
import { mono } from "@repo/ui/utils";
import { Arrow } from "@repo/ui/icons";
import { numString } from "@/lib/utils/numString";
import Countdown from "react-countdown";
import { useEffect, useState } from "react";

type GiveawayStatsProps = {
  giveaway: GiveawayRow;
} & React.HTMLAttributes<HTMLDivElement>;

const GiveawayStats = ({ giveaway, ...props }: GiveawayStatsProps) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const renderer = ({ days, hours, minutes, seconds, completed }: any) => {
    const dayHours = days * 24;
    hours = hours + dayHours;
    if (completed) {
      // Render a completed state
      return (
        <span className={cn(mono.className, "text-primary")}>00:00:00</span>
      );
    } else {
      // Render a countdown
      return (
        <span
          suppressHydrationWarning={true}
          className={cn(mono.className, "text-primary ")}
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

  const startDate = new Date(giveaway.start_time);

  const endDate = new Date(giveaway.end_time);

  return (
    <div className="w-full flex md:flex-row flex-col items-center justify-center text-[14px] gap-6 md:gap-8 ">
      <div className="flex flex-row gap-6 md:gap-8">
        <div className="flex flex-col space-y-2 justify-between">
          <span className={cn(mono.className, "text-white")}>Status</span>
          <span className={cn(mono.className, "text-primary")}>
            {startDate > now
              ? "Not Started"
              : endDate > now
                ? "Ongoing"
                : "Ended"}
          </span>
        </div>
        <div className="flex flex-col space-y-2">
          <span className={cn(mono.className, "text-white")}>
            Campaign Ends in:
          </span>
          <Countdown date={giveaway.end_time} renderer={renderer} />
        </div>
        <div className="flex flex-col space-y-2">
          <span className={cn(mono.className, "text-white")}># of Winners</span>
          <span className={cn(mono.className, "text-primary")}>
            {giveaway.winner_amount}
          </span>
        </div>
      </div>
      <div className="flex flex-row gap-6 md:gap-8">
        <div className="flex flex-col space-y-2">
          <span className={cn(mono.className, "text-white")}>Reward</span>
          <span className={cn(mono.className, "text-primary")}>
            {numString(giveaway.reward_amount)} $
            {giveaway.token_address ? giveaway.ticker : "SOL"}
          </span>
        </div>
        <div className="flex flex-col space-y-2">
          <span className={cn(mono.className, "text-white")}>Reward Value</span>
          <span className={cn(mono.className, "text-primary")}>
            ${giveaway.usd_value.toFixed(2)}
          </span>
        </div>
        <div className="flex flex-col space-y-2">
          <span className={cn(mono.className, "text-white")}>
            Creator Address
          </span>
          <span className={cn(mono.className, "text-primary")}>
            {giveaway.creator_key
              ? `${giveaway.creator_key.slice(
                  0,
                  4
                )}...${giveaway.creator_key.slice(-4)}`
              : "XXXX"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default GiveawayStats;
