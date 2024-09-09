import { GiveawayEntryRow, GiveawayWinnerRow } from "@/lib/types/giveaway";
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
import { GiveawayPageData } from "@/lib/data/giveaway/getGiveawayPage";
import { PublicKey } from "@solana/web3.js";

type GiveawayCardProps = {
  giveaway: GiveawayPageData;
  entry: GiveawayEntryRow | null;
  winner: GiveawayWinnerRow | null;
  completedCount: number;
  userId: string | null;
};

export default function GiveawayCard({
  giveaway,
  entry,
  winner,
  completedCount,
  userId,
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

  if (!userId) return <GiveawayLogin endDate={endDate} />;
  if (startDate > now) return <GiveawayNotStarted startDate={startDate} />;
  if (!entry && endDate > now)
    return (
      <GiveawayEnter
        completedCount={completedCount}
        wallet={wallet}
        endDate={endDate}
        userId={userId}
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
        userId={userId}
        creatorKey={new PublicKey(giveaway.creator_key)}
      />
    );
  if (entry && endDate < now) return <GiveawayLoser />;
  return <GiveawayEnded />;
}
