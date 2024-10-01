"use client";
import { cn } from "@repo/ui/utils";
import { mono } from "@repo/ui/utils";
import { Dropper } from "@repo/ui/icons";
import { numString } from "@/lib/utils/numString";
import Image from "next/image";
import Link from "next/link";
import Countdown from "react-countdown";
import { TickerGiveaway } from "@/lib/data/getTickers";

type TickerItemOptions = {
  ticker: TickerGiveaway;
  index: number;
};

export default function TickerItem({ ticker, index }: TickerItemOptions) {
  const endDate = new Date(ticker.end_time);

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
      // Render a countdown
      return (
        <span
          suppressHydrationWarning={true}
          className={cn(mono.className, "text-primary font-semibold")}
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
    <Link href={`/drops/${ticker.id}`} className="hover:underline">
      <div className="flex flex-row gap-1 items-center mr-8">
        <span className="text-placeholder">#{index + 1}</span>
        <Image width={14} height={14} src={ticker.icon_url} alt="icon" />
        <span>
          ${ticker.ticker.replaceAll("$", "").toUpperCase().slice(0, 8)}
        </span>
        <span className={cn(mono.className, "text-primary font-semibold")}>
          {numString(ticker.reward_amount)} $
          {ticker.token_address ===
          "So11111111111111111111111111111111111111112"
            ? "SOL"
            : `${ticker.ticker.replaceAll("$", "").toUpperCase().slice(0, 8)}`}
        </span>
        <Dropper />
        <Countdown date={endDate} renderer={renderer} />
      </div>
    </Link>
  );
}
