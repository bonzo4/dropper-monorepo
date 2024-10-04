import { ListingPageData } from "@/lib/data/listings/getListingPage";
import { numString } from "@/lib/utils/numString";
import { cn } from "@repo/ui/utils";
import { mono } from "@repo/ui/utils";
import { Stats } from "fs";

type Options = {
  listing: ListingPageData;
};

export default function ListingStats({ listing }: Options) {
  return (
    <div className="w-full flex lg:flex-row flex-wrap justify-center sm:justify-between text-[14px] lg:gap-0 gap-8 px-8">
      <div className="flex flex-col gap-2 w-[80px]">
        <div className="flex flex-col">
          <span>Market</span>
          <span>Cap</span>
        </div>

        <span className={cn(mono.className, "text-primary")}>
          {numString(listing.market_cap)}
        </span>
      </div>
      <div className="flex flex-col gap-2  w-[80px]">
        <div className="flex flex-col">
          <span>USD</span>
          <span>PRICE</span>
        </div>
        <span className={cn(mono.className, "text-primary")}>
          $
          {listing.usd_price > 1000
            ? numString(listing.usd_price)
            : listing.usd_price < 0.01
              ? listing.usd_price.toFixed(5)
              : listing.usd_price.toFixed(2)}
        </span>
      </div>
      <div className="flex flex-col gap-2  w-[80px]">
        <div className="flex flex-col">
          <span>24 HOUR</span>
          <span>VOLUME</span>
        </div>
        <span className={cn(mono.className, "text-primary")}>
          ${numString(listing.volume_24h)}
        </span>
      </div>
      <div className="flex flex-col gap-2  w-[80px]">
        <div className="flex flex-col">
          <span>Total</span>
          <span>Views</span>
        </div>
        <span className={cn(mono.className, "text-primary")}>
          {listing.stats ? listing.stats.views : 0}
        </span>
      </div>
      <div className="flex flex-col gap-2  w-[80px]">
        <div className="flex flex-col">
          <span>Total</span>
          <span>Bumps</span>
        </div>
        <span className={cn(mono.className, "text-primary")}>
          {listing.stats ? listing.stats.bumps : 0}
        </span>
      </div>
      <div className="flex flex-col gap-2  w-[80px]">
        <div className="flex flex-col">
          <span>Total</span>
          <span>Comments</span>
        </div>
        <span className={cn(mono.className, "text-primary")}>
          {listing.stats ? listing.stats.comments : 0}
        </span>
      </div>
    </div>
  );
}
