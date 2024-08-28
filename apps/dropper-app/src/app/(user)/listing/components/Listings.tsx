"use client";

import { ListingCardData } from "@/app/api/listing/route";
import { useListings } from "@/lib/hooks/useListings";
import { useState } from "react";
import { CgSpinner } from "react-icons/cg";
import ListingCard from "./ListingCard";
import PageNav from "@/components/PageNav";

type Props = {
  listings: ListingCardData[];
} & React.HTMLAttributes<HTMLDivElement>;

export default function Listings({ listings, ...props }: Props) {
  const [page, setPage] = useState(1);
  const [currentListing, setCurrentListing] =
    useState<ListingCardData | null>();

  const { listingsData, loading } = useListings({
    initialListings: listings,
    page,
  });

  return (
    <div className="flex flex-col gap-3 px-4 lg:px-0 w-full lg:max-w-[1150px]">
      {listingsData.length === 0 && !loading && (
        <div className="flex w-full py-10 justify-center">
          <span className="opacity-25">No ctos found</span>
        </div>
      )}
      {loading && (
        <div className="flex w-full py-10 justify-center">
          <CgSpinner size={75} className="animate-spin" />
        </div>
      )}
      {!loading && (
        <div className="relative flex flex-wrap justify-start items-center text-text font-fff-forward grow gap-6 lg:space-y-0 pb-4">
          {listingsData.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
      <PageNav
        page={page}
        setPage={setPage}
        docCount={listingsData.length}
        maxDocs={12}
      />
    </div>
  );
}
