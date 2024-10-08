import { Paragraph, Tab } from "@repo/ui";
import ListingInfo from "./components/ListingInfo";
import { Button } from "@repo/ui";
import {
  DexscreenerColor,
  DiscordColor,
  TelegramColor,
  Twitter,
} from "@repo/ui/icons";
import ListingRouter from "./components/ListingsRouter";
import { getListingPage } from "@/lib/data/listings/getListingPage";
import { createSupabaseServer } from "@repo/lib/supabase";
import { Metadata, ResolvingMetadata } from "next";
import ListingStats from "./components/ListingStats";
import BumpList from "./components/BumpList";
import ListingCommentList from "./components/ListingCommentList";
import { listingPageView } from "@/lib/actions/listings/listingPageView";
import { DropmanRow } from "@/lib/types/user";

type Params = {
  id: number;
};

type Props = {
  params: Params;
};

export async function generateMetadata(
  { params: { id } }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const supabase = await createSupabaseServer();
  const listing = await getListingPage({ supabase, id, userId: null });
  if (!listing) throw new Error("Listing not found");
  return {
    title: `${listing.name} | Dropper`,
    description: `dropper.wtf - ${listing.description}`,
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
      listing.name,
      listing.ticker,
    ],
    openGraph: {
      title: `${listing.name} | Dropper`,
      description: `dropper.wtf - ${listing.description}`,
      type: "website",
      url: `https://dropper.wtf/listings/${id}`,
      images: [
        {
          url: "https://pmlweoiqgtcwuxpclgql.supabase.co/storage/v1/object/public/website/Dropper_banner.png",
          width: 2460,
          height: 820,
          alt: "Dropper",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${listing.name} | Dropper`,
      description: `dropper.wtf - ${listing.description}`,
      creator: "@DropperNTWRK",
      site: "@DropperNTWRK",
      images: [
        {
          url: "https://pmlweoiqgtcwuxpclgql.supabase.co/storage/v1/object/public/website/Dropper_banner.png",
          width: 2460,
          height: 820,
          alt: "Dropper",
        },
      ],
    },
  };
}

export default async function ListingPage({ params: { id } }: Props) {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  //   setUser(user);
  let dropman: DropmanRow | null = null;
  if (user) {
    const { data } = await supabase
      .from("dropmans")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (data) dropman = data;
  }

  const listing = await getListingPage({
    supabase,
    id,
    userId: user?.id || null,
  });

  if (!listing) return null;

  await listingPageView({ listing });

  return (
    <main className="relative flex flex-col items-center justify-start grow py-20">
      <ListingRouter
        prevListingId={listing.prevListingId}
        nextListingId={listing.nextListingId}
      />
      <div className="w-full relative overflow-hidden flex flex-col items-start justify-start gap-[40px] max-w-[737px]">
        <ListingInfo listing={listing} />
        <ListingStats listing={listing} />
        <Paragraph className="px-20">{listing.description}</Paragraph>
        <div className="flex flex-wrap gap-[30px] w-full justify-center">
          {listing.twitter_url && (
            <a href={listing.twitter_url} target="_blank">
              <Button className="px-14 py-2 flex gap-[10px] w-[320px]">
                <Twitter height={30} />
                <span className="text-2xl">X (TWITTER)</span>
              </Button>
            </a>
          )}
          {listing.discord_url && (
            <a href={listing.discord_url} target="_blank">
              <Button className="px-12 py-2 flex gap-[10px] w-[320px]">
                <DiscordColor height={30} />
                <span className="text-2xl">DISCORD</span>
              </Button>
            </a>
          )}
          {listing.telegram_url && (
            <a href={listing.telegram_url} target="_blank">
              <Button className="px-14 py-2 flex gap-[10px] w-[320px]">
                <TelegramColor height={30} />
                <span className="text-2xl">TELEGRAM</span>
              </Button>
            </a>
          )}
          {listing.dexscreener_url && (
            <a href={listing.dexscreener_url} target="_blank">
              <Button className="px-12 py-2 flex gap-[10px] w-[320px]">
                <DexscreenerColor height={30} />
                <span className="text-2xl">DEXSCREENER</span>
              </Button>
            </a>
          )}
        </div>
        <Tab label="Bumps" className="w-full flex">
          <BumpList
            listingId={id}
            bumpCount={listing.stats?.total_bumps || 0}
          />
        </Tab>
        <Tab label="Comments" className="w-full flex flex-col gap-4">
          {/* <ListingCommentCreate
            listingId={id}
            dropman={dropman}
            listingName={listing.name}
          /> */}
          <ListingCommentList
            listingId={id}
            dropman={dropman}
            listingName={listing.name}
            userBumps={listing.userBumps}
          />
        </Tab>
      </div>
    </main>
  );
}
