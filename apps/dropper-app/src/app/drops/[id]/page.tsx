import GiveawayInfo from "./components/GiveawayInfo";
import { Paragraph } from "@/components/ui/Paragraph";
import GiveawayStats from "./components/GiveawayStats";
import GiveawayEntry from "./components/GiveawayEntry";
import { createSupabaseServer } from "@/lib/supabase/server";
import GiveawayRouter from "./components/GiveawayRouter";
import { getGiveawayPage } from "@/lib/data/giveaway/getGiveawayPage";
import { getGiveawayEntry } from "@/lib/data/giveaway/getGiveawayEntry";
import { getGiveawayWinner } from "@/lib/data/giveaway/getGiveawayWinner";

export default async function GiveawayPage({
  params: { id },
}: {
  params: { id: number };
}) {
  const supabase = createSupabaseServer();
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
