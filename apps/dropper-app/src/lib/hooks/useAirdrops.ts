import { SupabaseClient } from "@supabase/supabase-js";
import { AirdropPreviewItem } from "../types/airdrop";
import { useEffect, useState } from "react";
import { getAirdrops } from "../data/getAirdrops";
import { DatabaseTypes } from "@repo/app-types/database";

type UseAirdropsOptions = {
  supabase: SupabaseClient<DatabaseTypes>;
  airdrops: AirdropPreviewItem[];
  searchParams: URLSearchParams;
};

export function useAirdrops({
  supabase,
  airdrops,
  searchParams,
}: UseAirdropsOptions) {
  const [currentAirdrops, setAirdrops] =
    useState<AirdropPreviewItem[]>(airdrops);

  useEffect(() => {
    const refetchAirdrops = async () => {
      const data = await getAirdrops(searchParams);
      setAirdrops(data);
    };
    refetchAirdrops();
  }, [supabase, searchParams]);

  return { currentAirdrops };
}
