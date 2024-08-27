import { SupabaseClient } from "@supabase/supabase-js";

import { useEffect, useState } from "react";
import { BannerRow } from "../types/banner";
import { DatabaseTypes } from "@repo/app-types/database";

type UseBannerOptions = {
  supabase: SupabaseClient<DatabaseTypes>;
};

export function useBanners({ supabase }: UseBannerOptions) {
  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState<BannerRow[]>([]);

  useEffect(() => {
    async function fetchBanners() {
      const { data } = await supabase.from("banners").select("*");
      if (data) {
        setBanners(data);
      }
      setLoading(false);
    }

    fetchBanners();
  }, [supabase]);

  return { banners, loading };
}
