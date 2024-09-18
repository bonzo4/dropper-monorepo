import { Button } from "@repo/ui";
import Link from "next/link";
import GiveawayBannerSlider from "./components/GiveawayBannerSlider";
import Giveaways from "./components/Giveaways";
import { createSupabaseServer } from "@repo/lib/supabase";
import { getGiveawayBanners } from "@/lib/data/giveaway/getGiveawayBanners";
import dropzone from "@/public/dropzone.gif";
import dropzoneMobile from "@/public/dropzone-mobile.gif";
import Image from "next/image";

export default async function Home() {
  const supabase = await createSupabaseServer();
  const bannersData = getGiveawayBanners({ supabase });

  const [banners] = await Promise.all([bannersData]);

  return (
    <main className="flex flex-col items-center grow gap-[64px] py-16">
      <div className="flex flex-col items-center gap-5 px-4">
        <Image src={dropzone} alt="dropzone" className="hidden sm:flex" />
        <Image
          src={dropzoneMobile}
          alt="dropzone mobile"
          className="flex sm:hidden"
        />
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
