import { Notification, Confetti, Angry } from "@repo/ui/icons";
import { Button } from "@repo/ui";
import { GiveawayWinnerRow } from "@/lib/types/giveaway";
import Link from "next/link";

export default function GiveawayLoser() {
  return (
    <div className="relative flex flex-col items-center w-[300px] md:w-[570px] border-2 border-red rounded-md p-4 gap-5">
      <Angry width={80} height={74} />
      <span className="text-xl">OOF, YOU ARE NOT A WINNER...</span>
      <span className="text-base text-red">BETTER LUCK NEXT TIME</span>
      <Link href={"/"}>
        <Button>Play Again</Button>
      </Link>
    </div>
  );
}
