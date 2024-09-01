import { GiveawayBannerRow, ListingBannerRow } from "@/lib/types/banner";
import Button from "@/components/ui/Button";
import Link from "next/link";
import Listings from "./components/Listings";
import ListingBannerSlider from "./components/ListingBannerSlider";
import { ListingCardData } from "@/app/api/listings/route";

export default async function Home() {
  const banners = await getBanners();

  return (
    <main className="relative flex flex-col items-center grow gap-[68px] py-16">
      <div className="flex flex-col items-center gap-5 px-4">
        {/* <Dropzone className="" /> */}
        <h1 className="flex text-md text-center font-bold text-yellow">
          YOU HAVE ENTERED THE DROP BOARD: ...
        </h1>
        <div className="flex flex-row gap-2">
          <Link href="/listings/create">
            <Button className=" ">CREATE CTO</Button>
          </Link>
        </div>
      </div>
      <ListingBannerSlider banners={[...banners]} />
      <Listings />
    </main>
  );
}

async function getBanners() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/listings/banners`,
      {
        next: {
          revalidate: 60,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to fetch banners");
    }

    return response.json() as Promise<ListingBannerRow[]>;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function getListings() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/listings`,
      {
        cache: "no-cache",
      }
    );

    if (response.status !== 200) {
      console.log(await response.json());
      throw new Error("Failed to fetch listings");
    }

    return response.json() as Promise<ListingCardData[]>;
  } catch (error) {
    console.error(error);
    return [];
  }
}
