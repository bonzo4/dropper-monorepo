import { Bump } from "@repo/ui/icons";
import { ListingCardData } from "@/lib/data/listings/getListings";
import { cn } from "@repo/ui/utils";
import { mono } from "@repo/ui/utils";
import { numString } from "@/lib/utils/numString";
import Image from "next/image";
import Link from "next/link";
import ChainBadge from "./ChainBadge";

type Props = {
  listing: ListingCardData;
  showBump: (id: number) => void;
};

export default function ListingCard({ listing, showBump }: Props) {
  const show = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    showBump(listing.id);
  };

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="flex flex-col gap-2 p-3 border-2 border-primary rounded-md hover:bg-white hover:bg-opacity-15 bg-secondary"
    >
      <div className="flex flex-row gap-2">
        <div className="w-[83px] h-[83px] overflow-hidden rounded-md flex items-center justify-center">
          <Image
            src={listing.icon_url}
            alt={listing.ticker}
            width={83}
            height={83}
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-1 ">
          <div className="flex flex-row justify-between items-center w-[210px] lg:w-[250px] gap-1">
            <span className="text-2xl text-primary truncate -my-2 hover:underline-my-2">
              ${listing.ticker.slice(0, 8)}
            </span>
            <div className="flex flex-row gap-[2px]">
              <ChainBadge chain={listing.chain} />
              {/* <McapBadge mcap={listing.ath * listing.total_supply} /> */}
              {/* <VolumeBadge volume={listing.atv} /> */}
              {/* <HolderBadge holders={listing.holder_count} /> */}
            </div>
            <button className="flex" onClick={show}>
              <Bump className="" />
            </button>
          </div>
          <span
            className={cn(
              mono.className,
              "text-wrap text-[12px] w-[210px] lg:w-[250px] h-[52px] truncate"
            )}
          >
            <span>{listing.name}</span>
            <span className=""> - {listing.description}</span>
          </span>
        </div>
      </div>
      <div className="flex flex-row justify-between w-full">
        <div className="flex flex-col items-center gap-1">
          <span className="text-[12px]">MARKET CAP</span>
          <span
            className={cn(
              mono.className,
              "text-[14px] text-primary font-semibold"
            )}
          >
            {numString(listing.market_cap)}
          </span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-[12px]">USD PRICE</span>
          <span
            className={cn(
              mono.className,
              "text-[14px] text-primary font-semibold"
            )}
          >
            $
            {listing.usd_price > 1000
              ? numString(listing.usd_price)
              : listing.usd_price < 0.01
                ? listing.usd_price.toFixed(5)
                : listing.usd_price.toFixed(2)}
          </span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-[12px]">24H VOLUME</span>
          <span
            className={cn(
              mono.className,
              "text-[14px] text-primary font-semibold"
            )}
          >
            ${numString(listing.volume_24h)}
          </span>
        </div>
      </div>
    </Link>
  );
}
