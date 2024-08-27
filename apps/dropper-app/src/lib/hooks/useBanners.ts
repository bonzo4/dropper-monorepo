import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../supabase/types";
import { useEffect, useState } from "react";
import { BannerRow } from "../types/banner";

type UseBannerOptions = {
  supabase: SupabaseClient<Database>;
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
