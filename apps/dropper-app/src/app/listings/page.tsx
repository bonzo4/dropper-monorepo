import { Button } from "@repo/ui";
import Link from "next/link";
import Listings from "./components/Listings";
import ListingBannerSlider from "./components/ListingBannerSlider";
import { getListingBanners } from "@/lib/data/listings/getListingBanners";
import { createSupabaseServer } from "@repo/lib/supabase";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Listings & CTOs | Dropper",
  description:
    "dropper.wtf - List and bump your favorite Tokens and Meme-Coins.",
  keywords: [
    "crypto",
    "cryptocurrency",
    "blockchain",
    "token",
    "meme-coin",
    "listing",
    "community",
    "airdrop",
    "solana",
    "ethereum",
    "bitcoin",
  ],
  openGraph: {
    url: "https://dropper.wtf/listings",
    type: "website",
    title: "Listings & CTOs | Dropper",
    description:
      "dropper.wtf - List and bump your favorite Tokens and Meme-Coins.",
    images: [
      {
        url: "https://pmlweoiqgtcwuxpclgql.supabase.co/storage/v1/object/public/website/thumbnail2.png",
        width: 1440,
        height: 1274,
        alt: "Dropper",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Listings & CTOs | Dropper",
    description:
      "dropper.wtf - List and bump your favorite Tokens and Meme-Coins.",
    creator: "@DropperNTWRK",
    site: "@DropperNTWRK",
    images: [
      {
        url: "https://pmlweoiqgtcwuxpclgql.supabase.co/storage/v1/object/public/website/thumbnail2.png",
        width: 1440,
        height: 1274,
        alt: "Dropper",
      },
    ],
  },
  alternates: {
    canonical: "https://dropper.wtf/listings",
  },
};

export default async function ListingsPage() {
  const supabase = await createSupabaseServer();
  const banners = await getListingBanners({ supabase });

  return (
    <main className="relative flex flex-col items-center grow gap-[68px] py-16">
      <div className="flex flex-col items-center gap-5 px-4">
        {/* <Dropzone className="" /> */}
        <h1 className="flex text-md text-center font-bold text-yellow">
          YOU HAVE ENTERED THE DROP BOARD: ...
        </h1>
        <div className="flex flex-row gap-2">
          <Link href="/listings/create">
            <Button className=" ">CREATE LISTING</Button>
          </Link>
        </div>
      </div>
      <ListingBannerSlider banners={[...banners]} />
      <Listings />
    </main>
  );
}
