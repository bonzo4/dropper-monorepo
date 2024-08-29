import { GiveawayBannerRow } from "@/lib/types/banner";
import Button from "@/components/ui/Button";
import Link from "next/link";
import GiveawayBannerSlider from "./components/GiveawayBannerSlider";
import Giveaways from "./components/Giveaways";
import { LandingGiveaway } from "../api/giveaways/route";
import { Dropzone, DropzoneMobile } from "@/components/icons";

export default async function Home() {
  const banners = await getBanners();
  const giveaways = await getGiveaways();
  const solValue = await getSolValue();

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
      <GiveawayBannerSlider banners={[...banners]} />
      <Giveaways giveaways={giveaways} solValue={solValue} />
    </main>
  );
}

async function getBanners() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/giveaways/banners`,
      {
        next: {
          revalidate: 60,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to fetch banners");
    }

    return response.json() as Promise<GiveawayBannerRow[]>;
  } catch (error) {
    return [];
  }
}

async function getGiveaways() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/giveaways`,
      {
        cache: "no-cache",
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to fetch landing page giveaways");
    }

    return response.json() as Promise<LandingGiveaway[]>;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function getSolValue() {
  try {
    const response = await fetch(
      "https://api.dexscreener.com/latest/dex/tokens/So11111111111111111111111111111111111111112",
      {
        next: {
          revalidate: 60,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to fetch SOL value");
    }

    const data = await response.json();

    return data.pairs[0].priceUsd as number;
  } catch (error) {
    console.error(error);
    return 0;
  }
}
