import Button from "@/components/ui/Button";
import Link from "next/link";
import GiveawayBannerSlider from "./components/GiveawayBannerSlider";
import Giveaways from "./components/Giveaways";
import { Dropzone, DropzoneMobile } from "@/components/icons";
import { createSupabaseServer } from "@/lib/supabase/server";
import { getGiveawayBanners } from "@/lib/data/giveaway/getGiveawayBanners";
import { cache } from "react";

export default async function Home() {
  const supabase = createSupabaseServer();
  const bannersData = getGiveawayBanners({ supabase });

  const [banners] = await Promise.all([bannersData]);

  return (
    <main className="flex flex-col items-center grow gap-[68px] py-16">
      <div className="flex flex-col items-center gap-5 px-4">
        <Dropzone className="hidden sm:flex" />
        <DropzoneMobile className="flex sm:hidden" />
        <div className="flex flex-row gap-2">
          <Link href="/drops/create">
            <Button className=" ">CREATE DROP</Button>
          </Link>
          <Link href="/drops/manage">
            <Button className=" ">MANAGE DROPS</Button>
          </Link>
        </div>
      </div>
      <GiveawayBannerSlider banners={banners} />
      <Giveaways />
    </main>
  );
}
