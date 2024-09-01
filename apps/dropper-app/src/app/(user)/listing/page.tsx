import { ListingBannerRow } from "@repo/types/banner";
import Button from "@repo/ui/Button";
import Link from "next/link";
import Listings from "./components/Listings";
import ListingBannerSlider from "./components/ListingBannerSlider";
import { ListingCardData } from "@/app/api/listing/route";

export default async function Home() {
  const banners = await getBanners();
  const listings = await getListings();

  return (
    <main className="flex flex-col items-center grow gap-[68px] py-16">
      <div className="flex flex-col items-center gap-5 px-4">
        {/* <Dropzone className="" /> */}
        <h1 className="flex text-md text-center font-bold text-yellow">
          YOU HAVE ENTERED THE DROP BOARD: ...
        </h1>
        <div className="flex flex-row gap-2">
          <Link href="/listing/create">
            <Button className=" ">CREATE CTO</Button>
          </Link>
        </div>
      </div>
      <ListingBannerSlider banners={[...banners]} />
      <Listings listings={listings} />
    </main>
  );
}

async function getBanners() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/listing/banners`,
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/listing`, {
      cache: "no-cache",
    });

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
