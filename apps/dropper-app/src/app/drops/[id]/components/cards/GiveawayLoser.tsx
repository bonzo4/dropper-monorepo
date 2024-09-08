import { Notification, Confetti, Angry } from "@/components/icons";
import Button from "@/components/ui/Button";
import { GiveawayWinnerRow } from "@/lib/types/giveaway";
import Link from "next/link";

export default function GiveawayLoser() {
  return (
    <div className="relative flex flex-col items-center w-[300px] md:w-[570px] border-2 border-red rounded-md p-4 gap-5">
      <div className="flex w-full justify-end">
        <Notification width={26} height={20} />
      </div>
      <Angry width={80} height={74} />
      <span className="text-xl">OOF, YOU ARE NOT A WINNER...</span>
      <span className="text-base text-red">BETTER LUCK NEXT TIME</span>
      <Link href={"/"}>
        <Button>Play Again</Button>
      </Link>
    </div>
  );
}
