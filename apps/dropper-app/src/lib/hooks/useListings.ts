import { useEffect, useState } from "react";
import { createSupabaseClient } from "@repo/lib/supabase";
import { ListingRow } from "../types/listing";
import { getListings, ListingCardData } from "../data/listings/getListings";

type Options = {
  page?: number;
};

export function useListings({ page }: Options) {
  const supabase = createSupabaseClient();
  const [loading, setLoading] = useState(true);
  const [listingsData, setListings] = useState<ListingCardData[]>([]);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      const listings = await getListings({ supabase, page });
      setListings(listings);
      setLoading(false);
    };

    if (page === 1) {
      fetchListings();
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
