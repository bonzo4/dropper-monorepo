"use client";
import { TickerGiveaway } from "@/app/api/giveaways/tickers/route";
import { cn } from "@/lib/utils/classNames";
import { mono } from "@/lib/utils/fonts";
import { Dropper } from "@/components/icons";
import { numString } from "@/lib/utils/numString";
import Image from "next/image";
import Link from "next/link";
import Countdown from "react-countdown";

type TickerItemOptions = {
  ticker: TickerGiveaway;
  index: number;
};

export default function TickerItem({ ticker, index }: TickerItemOptions) {
  const endDate = new Date(ticker.end_time);

  const renderer = ({ hours, minutes, seconds, completed }: any) => {
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
    <Link href={`/drops/${ticker.id}`}>
      <div className="flex flex-row gap-1 items-center mr-8">
        <span className="text-placeholder">#{index + 1}</span>
        <Image width={14} height={14} src={ticker.icon_url} alt="icon" />
        <span>{ticker.ticker}</span>
        <span className={cn(mono.className, "text-primary font-semibold")}>
          {numString(ticker.reward_amount)}{" "}
          {ticker.token_address ? ticker.ticker : "SOL"}
        </span>
        <Dropper />
        <Countdown date={endDate} renderer={renderer} />
      </div>
    </Link>
  );
}
