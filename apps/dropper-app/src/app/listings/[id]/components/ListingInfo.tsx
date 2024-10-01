import { ListingPageData } from "@/lib/data/listings/getListingPage";
import Image from "next/image";

type Props = {
  listing: ListingPageData;
} & React.HTMLAttributes<HTMLDivElement>;

export default function ListingInfo({ listing, ...props }: Props) {
  return (
    <div
      {...props}
      className="w-full relative overflow-hidden flex flex-row items-center pl-4 sm:pl-0 sm:justify-start gap-[20px] text-[24px] sm:text-[37px] text-text font-fff-forward b"
    >
      <div className="w-[119px] h-[119px] overflow-hidden rounded-md flex items-center justify-center">
        <Image
          src={listing.icon_url}
          alt={listing.name}
          width={119}
          height={119}
          className="w-auto h-auto"
        />
      </div>
      <div className="self-stretch overflow-hidden flex flex-col items-start justify-start">
        <div className="flex flex-row items-center justify-start">
          <h1 className="relative text-[32px] sm:text-[50px]">
            {listing.name} (${listing.ticker})
          </h1>
        </div>
      </div>
    </div>
  );
}
