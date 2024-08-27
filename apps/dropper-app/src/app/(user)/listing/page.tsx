import { GiveawayBannerRow } from "@/lib/types/banner";
import Button from "@/components/ui/Button";
import Link from "next/link";
import GiveawayBannerSlider from "../components/GiveawayBannerSlider";
import Listings from "./components/Listings";

export default async function Home() {
  const banners = await getBanners();

  return (
    <main className="flex flex-col items-center grow gap-[68px] py-16">
      <div className="flex flex-col items-center gap-5 px-4">
        {/* <Dropzone className="" /> */}
        <h1 className="flex sm:hidden text-md text-center font-bold text-yellow">
          YOU HAVE ENTERED THE DROP BOARD: ...
        </h1>
        <div className="flex flex-row gap-2">
          <Link href="/listing/create">
            <Button className=" ">CREATE CTO</Button>
          </Link>
          {/* <Link href="/community/manage">
            <Button className=" ">MANAGE CTOS</Button>
          </Link> */}
        </div>
      </div>
      <GiveawayBannerSlider
        banners={[...banners, ...banners, ...banners, ...banners]}
      />
      <Listings />
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
    console.error(error);
    return [];
  }
}
