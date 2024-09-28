import { useEffect, useState } from "react";
import { createSupabaseClient } from "@repo/lib/supabase";
import { ListingBumpRow, ListingRow } from "../types/listing";
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
      const listingsChannel = supabase
        .channel("realtime listings")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "listings",
          },
          (payload) => {
            const updatedListing = payload.new as ListingRow;
            setListings((listings) => {
              const newListings = listings.slice(0, -1);
              return [updatedListing, ...newListings];
            });
          }
        )
        .subscribe();

      const bumpsChannel = supabase.channel("realtime bumps").on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bumps",
        },
        async (payload) => {
          const updatedBump = payload.new as ListingBumpRow;
          const { data: listingData } = await supabase
            .from("listings")
            .select("*")
            .eq("id", updatedBump.listing_id)
            .single();
          if (!listingData) return;
          setListings((listings) => {
            const newListings = listings.slice(0, -1);
            return [listingData, ...newListings];
          });
        }
      );

      return () => {
        listingsChannel.unsubscribe();
      };
    }

    fetchListings();
  }, [page, supabase]);

  return { listingsData, loading } as const;
}
