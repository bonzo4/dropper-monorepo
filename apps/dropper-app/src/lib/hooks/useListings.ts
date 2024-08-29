import { ListingCardData } from "@/app/api/listings/route";
import { useEffect, useState } from "react";
import { createSupabaseClient } from "../supabase/client";
import { ListingRow } from "../types/listing";

type Options = {
  initialListings: ListingCardData[];
  page?: number;
};

export function useListings({ page = 1, initialListings }: Options) {
  const supabase = createSupabaseClient();
  const [loading, setLoading] = useState(false);
  const [listingsData, setListings] =
    useState<ListingCardData[]>(initialListings);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/listings?page=${page}`,
        {
          cache: "no-cache",
        }
      );

      if (response.status !== 200) {
        setListings([]);
      } else {
        const data = (await response.json()) as ListingCardData[];
        setListings(data);
      }

      setLoading(false);
    };

    if (page === 1) {
      const channel = supabase
        .channel("realtime listings")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "listings",
          },
          (payload) => {
            const updatedListing = payload.new as ListingRow;
            const oldListing = payload.old as ListingRow;
            if (updatedListing.last_bump === oldListing.last_bump) return;
            setListings((listings) => {
              const newListings = listings.slice(0, -1);
              return [updatedListing, ...newListings];
            });
          }
        )
        .subscribe();

      return () => {
        channel.unsubscribe();
      };
    }

    fetchListings();
  }, [page, supabase]);

  return { listingsData, loading } as const;
}
