import { Bump } from "@repo/ui/icons";
import { ListingCardData } from "@/lib/data/listings/getListings";
import { SolBadge } from "@repo/ui/badges";
import { cn } from "@repo/ui/utils";
import { mono } from "@repo/ui/utils";
import { numString } from "@/lib/utils/numString";
import Image from "next/image";
import Link from "next/link";
import McapBadge from "./McapBadge";
import VolumeBadge from "./VolumeBadge";
import HolderBadge from "./HolderBadge";

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
      className="flex flex-col gap-2 p-3 border-2 border-primary rounded-md hover:bg-white hover:bg-opacity-10"
    >
      <div className="flex flex-row gap-2">
        <Image
          src={listing.icon_url}
          alt={listing.ticker}
          width={83}
          height={83}
          className="rounded-md"
        />
        <div className="flex flex-col gap-1 ">
          <div className="flex flex-row justify-between items-center w-[210px] lg:w-[250px] gap-1">
            <span className="text-2xl text-primary truncate -my-2 hover:underline-my-2">
              ${listing.ticker.slice(0, 5)}
            </span>
            <div className="flex flex-row gap-[2px]">
              <SolBadge />
              <McapBadge mcap={listing.ath * listing.total_supply} />
              <VolumeBadge volume={listing.atv} />
              <HolderBadge holders={listing.holder_count} />
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
          <span className="text-[12px]">TOTAL SUPPLY</span>
          <span
            className={cn(
              mono.className,
              "text-[14px] text-primary font-semibold"
            )}
          >
            {numString(listing.total_supply)}
          </span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-[12px]">ATH</span>
          <span
            className={cn(
              mono.className,
              "text-[14px] text-primary font-semibold"
            )}
          >
            ${numString(listing.ath)}
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
            ${numString(listing.atv)}
          </span>
        </div>
      </div>
    </Link>
  );
}
