import { Paragraph } from "@repo/ui";
import ListingInfo from "./components/ListingInfo";
import { Button } from "@repo/ui";
import {
  ArrowWhite,
  DexscreenerColor,
  TelegramColor,
  Twitter,
} from "@repo/ui/icons";
import Link from "next/link";
import ListingRouter from "./components/ListingsRouter";
import { getListingPage } from "@/lib/data/listings/getListingPage";
import { createSupabaseServer } from "@repo/lib/supabase";

export default async function ListingPage({
  params: { id },
}: {
  params: { id: number };
}) {
  const supabase = await createSupabaseServer();
  const listing = await getListingPage({ supabase, id });

  if (!listing) return null;

  return (
    <main className="relative flex flex-col items-center justify-start grow py-20">
      <ListingRouter
        prevListingId={listing.prevListingId}
        nextListingId={listing.nextListingId}
      />
      <div className="w-full relative overflow-hidden flex flex-col items-start justify-start gap-[40px] max-w-[737px]">
        <ListingInfo listing={listing} />
        <Paragraph className="px-20">{listing.description}</Paragraph>
        <div className="flex flex-wrap gap-[30px] w-full justify-center">
          {listing.twitter_url && (
            <Button className="px-14 py-2 flex gap-[10px]">
              <Twitter height={30} />
              <span className="text-2xl">X (TWITTER)</span>
            </Button>
          )}
          {listing.telegram_url && (
            <Button className="px-14 py-2 flex gap-[10px]">
              <TelegramColor height={30} />
              <span className="text-2xl">TELEGRAM</span>
            </Button>
          )}
          {listing.dexscreener_url && (
            <Button className="px-12 py-2 flex gap-[10px]">
              <DexscreenerColor height={30} />
              <span className="text-2xl">DEXSCREENER</span>
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
