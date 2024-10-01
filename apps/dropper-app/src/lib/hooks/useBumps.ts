import { SupabaseClient } from "@supabase/supabase-js";
import { ListingBumpRow } from "../types/listing";
import { DatabaseTypes } from "@repo/app-types/database";
import { useEffect, useState } from "react";

type Options = {
  supabase: SupabaseClient<DatabaseTypes>;
  listingId: number;
  page: number;
};

export function useBumps({ supabase, listingId, page }: Options) {
  const [bumps, setBumps] = useState<ListingBumpRow[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBumps = async () => {
      const query = supabase
        .from("listing_bumps")
        .select("*")
        .eq("listing_id", listingId)
        .order("created_at", { ascending: false });

      if (page > 1) {
        const start = (page - 1) * 10;
        const end = start + 10;
        query.range(start, end);
      } else {
        query.range(0, 10);
      }

      const { data, error } = await query;

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      const bumpsWithUser = await Promise.all(
        data.map(async (bump) => {
          const { data: user, error } = await supabase
            .from("dropmans_view")
            .select("username")
            .eq("user_id", bump.user_id)
            .single();

          if (error) {
            console.error(error);
            return bump;
          }

          return { ...bump, user: user?.username ?? "Unknown User" };
        })
      );
      setBumps(bumpsWithUser);
    };

    fetchBumps();
  }, [supabase, listingId, page]);

  return { bumps, loading };
}
