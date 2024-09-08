import { Bump } from "@/components/icons";
import { ListingCardData } from "@/lib/data/listings/getListings";
import { cn } from "@/lib/utils/classNames";
import { mono } from "@/lib/utils/fonts";
import { numString } from "@/lib/utils/numString";
import Image from "next/image";
import Link from "next/link";

type Props = {
  listing: ListingCardData;
  showBump: (id: number) => void;
};

export default function ListingCard({ listing, showBump }: Props) {
  return (
    <div className="flex flex-col gap-2 p-3 border-2 border-primary rounded-md">
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
            <Link
              href={`/listings/${listing.id}`}
              className="text-primary truncate -my-2 hover:underline"
            >
              <span className="text-2xl text-primary truncate">
                ${listing.ticker}
              </span>
            </Link>
            <div className="flex flex-row gap-[2px]">
              <div className="w-[21px] h-[21px] bg-placeholder rounded-sm" />
              <div className="w-[21px] h-[21px] bg-placeholder rounded-sm" />
              <div className="w-[21px] h-[21px] bg-placeholder rounded-sm" />
              <div className="w-[21px] h-[21px] bg-placeholder rounded-sm" />
            </div>
            <Bump
              className="hover:cursor-pointer"
              onClick={() => showBump(listing.id)}
            />
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
          <span className="text-[12px]">HOLDER COUNT</span>
          <span
            className={cn(
              mono.className,
              "text-[14px] text-primary font-semibold"
            )}
          >
            {listing.holder_count}
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
          <span className="text-[12px]">ALL-TIME VOLUME</span>
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
    </div>
  );
}
