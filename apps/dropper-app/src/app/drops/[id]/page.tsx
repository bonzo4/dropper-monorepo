import GiveawayInfo from "./components/GiveawayInfo";
import { Paragraph } from "@repo/ui";
import GiveawayStats from "./components/GiveawayStats";
import GiveawayEntry from "./components/GiveawayEntry";
import { createSupabaseServer } from "@repo/lib/supabase";
import GiveawayRouter from "./components/GiveawayRouter";
import { getGiveawayPage } from "@/lib/data/giveaway/getGiveawayPage";
import { getGiveawayEntry } from "@/lib/data/giveaway/getGiveawayEntry";
import { getGiveawayWinner } from "@/lib/data/giveaway/getGiveawayWinner";
import { Metadata, ResolvingMetadata } from "next";

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
  const giveawayPage = await getGiveawayPage({ supabase, id });
  if (!giveawayPage) throw new Error("Giveaway not found");
  return {
    title: `${giveawayPage.title} | Dropper`,
    description: `dropper.wtf - ${giveawayPage.description}`,
    keywords: [
      "crypto",
      "cryptocurrency",
      "blockchain",
      "token",
      "meme-coin",
      "drop",
      "giveaway",
      "airdrop",
      "solana",
      "ethereum",
      "bitcoin",
      giveawayPage.title,
      giveawayPage.ticker,
    ],
    openGraph: {
      title: `${giveawayPage.title} | Dropper`,
      description: `dropper.wtf - ${giveawayPage.description}`,
      type: "website",
      url: `https://dropper.wtf/drops/${id}`,
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
      title: `${giveawayPage.title} | Dropper`,
      description: `dropper.wtf - ${giveawayPage.description}`,
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
    alternates: {
      canonical: `https://dropper.wtf/drops/${id}`,
    },
  };
}

export default async function GiveawayPage({ params: { id } }: Props) {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const giveawayPageData = getGiveawayPage({ supabase, id });
  const entryData = getGiveawayEntry({
    supabase,
    id,
    userId: user ? user.id : null,
  });
  const winnerData = getGiveawayWinner({
    supabase,
    id,
    userId: user ? user.id : null,
  });

  const [giveaway, entry, winner] = await Promise.all([
    giveawayPageData,
    entryData,
    winnerData,
  ]);

  if (!giveaway || !giveaway.tx_string) return null;
  return (
    <div className=" relative flex flex-col items-center justify-start grow py-20">
      <GiveawayRouter
        nextGiveawayId={giveaway.nextGiveawayId}
        prevGiveawayId={giveaway.prevGiveawayId}
      />
      <div className="w-full relative overflow-hidden flex flex-col items-start justify-start gap-[40px] max-w-[737px]">
        <GiveawayInfo giveaway={giveaway} />
        <Paragraph className="px-20">{giveaway.description}</Paragraph>
        <GiveawayStats giveaway={giveaway} />
        <GiveawayEntry
          giveaway={giveaway}
          userId={user ? user.id : null}
          entry={entry}
          winner={winner}
        />
      </div>
    </div>
  );
}
