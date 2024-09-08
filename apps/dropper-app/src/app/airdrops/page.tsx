import BannerSlider from "./components/AirdropBannerSlider";
import Airdrops from "./components/Airdrops";
import { createSupabaseServer } from "@/lib/supabase/server";
import { getAirdropBanners } from "@/lib/data/airdrops/getAirDropBanners";
import { getFeaturedAirdrops } from "@/lib/data/airdrops/getFeatured";

export default async function Home() {
  const supabase = createSupabaseServer();
  const banners = await getAirdropBanners({ supabase });
  const airdrops = await getFeaturedAirdrops({ supabase });

  return (
    <main className="flex flex-col items-center grow space-y-4">
      <BannerSlider banners={banners} />
      <Airdrops airdrops={airdrops} />
    </main>
  );
}
