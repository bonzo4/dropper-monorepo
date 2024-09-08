import TickerItem from "./TickerItem";
import Marquee from "react-fast-marquee";
import { TickerGiveaway } from "@/lib/data/getTickers";

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
        {tickers.map((ticker, index) => (
          <TickerItem key={ticker.id} ticker={ticker} index={index} />
        ))}
      </Marquee>
    </div>
  );
}
