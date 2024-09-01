import { GiveawayPageData } from "@/app/api/giveaways/[id]/route";
import { User } from "@supabase/supabase-js";
import { GiveawayEntryRow, GiveawayWinnerRow } from "@repo/types/giveaway";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useMemo, useState } from "react";
import GiveawayClaimed from "./GiveawayClaimed";
import GiveawayDone from "./GiveawayDone";
import { revalidateGiveaway } from "@/lib/actions/revalidateGiveaway";
import GiveawayEnded from "./GiveawayEnded";
import GiveawayEnter from "./GiveawayEnter";
import GiveawayEntered from "./GiveawayEntered";
import GiveawayLogin from "./GiveawayLogin";
import GiveawayLoser from "./GiveawayLoser";
import GiveawayNotStarted from "./GiveawayNotStarted";
import GiveawayWinner from "./GiveawayWinner";

type GiveawayCardProps = {
  giveaway: GiveawayPageData;
  user: User | null;
  entry: GiveawayEntryRow | null;
  winner: GiveawayWinnerRow | null;
  completedCount: number;
};

export default function GiveawayCard({
  giveaway,
  user,
  entry,
  winner,
  completedCount,
}: GiveawayCardProps) {
  const [now, setNow] = useState(new Date());
  const startDate = useMemo(
    () => new Date(giveaway.start_time),
    [giveaway.start_time]
  );
  // const endDate = useMemo(new Date(giveaway.end_time));
  const endDate = useMemo(
    () => new Date(giveaway.end_time),
    [giveaway.end_time]
  );

  // Set up intervals to update the current date
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000); // Check every second

    return () => clearInterval(interval); // Clean up on component unmount
  }, []);

  // revalidate the page if it's after end time and before 30 seconds after
  useEffect(() => {
    const delay = endDate.getTime() + 30000 - now.getTime();

    if (delay > 0) {
      const timeoutId = setTimeout(() => {
        revalidateGiveaway(giveaway.id);
      }, delay);

      return () => clearTimeout(timeoutId); // Cleanup timeout on component unmount or before the effect runs again
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endDate, giveaway.id]);

  const wallet = useWallet();

  if (!user) return <GiveawayLogin endDate={endDate} />;
  if (startDate > now) return <GiveawayNotStarted startDate={startDate} />;
  if (!entry && endDate > now)
    return (
      <GiveawayEnter
        completedCount={completedCount}
        wallet={wallet}
        endDate={endDate}
        user={user}
        giveaway={giveaway}
      />
    );
  if (entry && endDate > now) return <GiveawayEntered endDate={endDate} />;
  if (now < new Date(endDate.getTime() + 35000)) return <GiveawayDone />;
  if (winner && winner.has_claimed) return <GiveawayClaimed />;
  if (winner)
    return (
      <GiveawayWinner
        wallet={wallet}
        endDate={endDate}
        winner={winner}
        tokenAddress={giveaway.token_address}
        giveawayId={giveaway.id}
        user={user}
      />
    );
  if (entry && endDate < now) return <GiveawayLoser />;
  return <GiveawayEnded />;
}
