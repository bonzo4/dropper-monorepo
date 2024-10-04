import TickerItem from "./TickerItem";
import Marquee from "react-fast-marquee";
import { TickerGiveaway } from "@/lib/data/getTickers";
import Link from "next/link";
import { Dropper, Icon } from "@repo/ui/icons";
import { cn, mono } from "@repo/ui/utils";

type TickerOptions = {
  width: number;
  tickers: TickerGiveaway[];
};

export default function Ticker({ width, tickers }: TickerOptions) {
  return (
    <div
      suppressHydrationWarning
      className="flex flex-row items-center overflow-hidden  border-b-2 border-primary px-5"
      style={{ width: width, maxWidth: width }}
    >
      <span className="text-primary w-[220px]">DROPS ENDING SOON:</span>
      <Marquee pauseOnHover className="">
        {tickers.length > 0 ? (
          tickers.map((ticker, index) => (
            <TickerItem key={ticker.id} ticker={ticker} index={index} />
          ))
        ) : (
          <Link href={`/drops/create`} className="hover:underline">
            <div className="flex flex-row gap-1 items-center mr-8">
              <Icon className="w-4 h-4" />
              <span>NO DROPS AT THE MOMENT</span>
              <span
                className={cn(mono.className, "text-primary font-semibold")}
              >
                Create one now!
              </span>
              <Dropper />
            </div>
          </Link>
        )}
      </Marquee>
    </div>
  );
}
