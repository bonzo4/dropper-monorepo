import { SupabaseClient } from "@supabase/supabase-js";

import { useEffect, useState } from "react";
import { AirdropBannerRow } from "../types/banner";
import { DatabaseTypes } from "@repo/app-types/database";

type UseBannerOptions = {
  supabase: SupabaseClient<DatabaseTypes>;
};

export function useAirdropBanners({ supabase }: UseBannerOptions) {
  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState<AirdropBannerRow[]>([]);

  useEffect(() => {
    async function fetchBanners() {
      const { data } = await supabase.from("airdrop_banners").select("*");
      if (data) {
        setBanners(data);
      }
      setLoading(false);
    }

    fetchBanners();
  }, [supabase]);

  return { banners, loading };
}
