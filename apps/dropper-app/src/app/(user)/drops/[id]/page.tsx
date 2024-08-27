import { GiveawayPageData } from "@/app/api/giveaways/[id]/route";
import GiveawayInfo from "./components/GiveawayInfo";
import { Paragraph } from "@/components/ui/Paragraph";
import GiveawayStats from "./components/GiveawayStats";
import GiveawayEntry from "./components/GiveawayEntry";
import { createSupabaseServer } from "@/lib/supabase/server";
import { GiveawayEntryRow, GiveawayWinnerRow } from "@/lib/types/giveaway";
import { headers } from "next/headers";

export default async function GiveawayPage({
  params: { id },
}: {
  params: { id: number };
}) {
  const giveaway = await getGiveaway(id);
  const entry = await getGiveawayEntry(id);
  const winner = await getGiveawayWinner(id);
  const solValue = await getSolValue();

  const supabase = createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!giveaway) return null;
  return (
    <div className="flex flex-col items-center justify-start grow py-20">
      <div className="w-full relative overflow-hidden flex flex-col items-start justify-start gap-[40px] max-w-[737px]">
        <GiveawayInfo giveaway={giveaway} />
        <Paragraph className="px-20">{giveaway.description}</Paragraph>
        <GiveawayStats giveaway={giveaway} solValue={solValue} />
        <GiveawayEntry
          giveaway={giveaway}
          user={user}
          entry={entry}
          winner={winner}
        />
      </div>
    </div>
  );
}

async function getGiveaway(id: number) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/giveaways/${id}`,
      {
        next: {
          revalidate: 60,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to fetch giveaway");
    }

    return response.json() as Promise<GiveawayPageData>;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getGiveawayEntry(id: number) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/giveaways/${id}/entry`,
    {
      cache: "no-cache",
      headers: new Headers(headers()),
    }
  );

  if (response.status !== 200) {
    return null;
  }

  const data = await response.json();

  return data as GiveawayEntryRow;
}

async function getGiveawayWinner(id: number) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/giveaways/${id}/winner`,
    {
      cache: "no-cache",
      headers: new Headers(headers()),
    }
  );

  if (response.status !== 200) {
    return null;
  }

  const data = await response.json();

  return data as GiveawayWinnerRow;
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

    const data = await response.json();

    return data.pairs[0].priceUsd as number;
  } catch (error) {
    console.error(error);
    return 0;
  }
}
