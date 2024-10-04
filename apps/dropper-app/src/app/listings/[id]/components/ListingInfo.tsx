import { ListingPageData } from "@/lib/data/listings/getListingPage";
import Image from "next/image";
import BumpListing from "./BumpListing";

type Props = {
  listing: ListingPageData;
} & React.HTMLAttributes<HTMLDivElement>;

export default function ListingInfo({ listing, ...props }: Props) {
  return (
    <div
      {...props}
      className="w-full relative overflow-hidden flex flex-row items-start px-4 sm:pl-0 justify-start gap-[20px] text-[24px] sm:text-[37px] text-text font-fff-forward "
    >
      <div className="w-[90px] h-[90px] sm:w-[119px] sm:h-[119px] overflow-hidden rounded-md flex items-center justify-center">
        <Image
          src={listing.icon_url}
          alt={listing.name}
          width={119}
          height={119}
          // className="w-auto h-auto"
        />
      </div>
      <div className="flex flex-row items-start justify-start w-full">
        <h1 className=" text-[32px] sm:text-[50px] -mt-2 w-[200px] sm:w-full">
          <span className="">{listing.name}</span>{" "}
          <span>
            (${listing.ticker.replaceAll("$", "").toUpperCase().slice(0, 8)})
          </span>
        </h1>
        <BumpListing listingId={listing.id} />
      </div>
    </div>
  );
}
