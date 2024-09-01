import { AirdropPreviewItem } from "@repo/types/airdrop";
import BannerSlider from "./components/BannerSlider";
import Airdrops from "./components/Airdrops";
import { BannerRow } from "@repo/types/banner";

export default async function Home() {
  const banners = await getBanners();
  const airdrops = await getFeaturedAirdrops();

  return (
    <main className="flex flex-col items-center grow space-y-4">
      <BannerSlider banners={banners} />
      <Airdrops airdrops={airdrops} />
    </main>
  );
}

async function getBanners() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/banners`, {
      next: {
        revalidate: 60,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to fetch banners");
    }

    return response.json() as Promise<BannerRow[]>;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function getFeaturedAirdrops() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/airdrops/featured`,
      {
        next: {
          revalidate: 60,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to fetch featured airdrops");
    }

    return response.json() as Promise<AirdropPreviewItem[]>;
  } catch (error) {
    console.error(error);
    return [];
  }
}
