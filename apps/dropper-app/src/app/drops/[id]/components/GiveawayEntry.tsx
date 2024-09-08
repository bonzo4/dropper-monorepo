"use client";

import { GiveawayEntryRow, GiveawayWinnerRow } from "@/lib/types/giveaway";
import { GiveawayPageData } from "@/app/api/giveaways/[id]/route";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { toast } from "react-toastify";
import { getRequirementCount } from "@/lib/utils/getRequirementCount";
import { User } from "@supabase/supabase-js";
import GiveawayCard from "./cards/GiveawayCard";
import { enterGiveaway } from "@/lib/actions/enterGiveaway";
import ToastStyling from "@/components/ToastStyling";
import { useWallet } from "@solana/wallet-adapter-react";
import Wallet from "@/components/Wallet";
import GiveawayRequirements from "./GiveawayRequirements";

type GiveawayEntryProps = {
  giveaway: GiveawayPageData;
  userId: string | null;
  entry: GiveawayEntryRow | null;
  winner: GiveawayWinnerRow | null;
} & React.HTMLAttributes<HTMLDivElement>;

export default function GiveawayEntry({
  giveaway,
  userId,
  entry,
  winner,
}: GiveawayEntryProps) {
  const endDate = new Date(giveaway.end_time);
  const now = new Date();
  const [completedCount, setCompletedCount] = useState(0);

  const [show, setShow] = useState(false);

  return (
    <Wallet>
      <div className="flex flex-col gap-10 w-full">
        <div className="w-full relative flex flex-col items-center justify-start gap-[40px] text-left text-xl text-text font-fff-forward md:px-0 px-4">
          <div className="flex-1 w-full relative rounded-md bg-secondary box-border overflow-hidden shrink-0 flex flex-row items-center justify-between py-4 px-5 gap-[28px] max-w-[737px] text-left  text-primary font-fff-forward border-[2px] border-solid border-primary hover:cursor-pointer z-10 ">
            {endDate > now ? (
              <h2 className="text-[20px]">Enter Now!</h2>
            ) : (
              <h2 className="text-[20px]">Check the Results!</h2>
            )}
            <Button onClick={() => setShow(!show)}>Show</Button>
          </div>
          {show && (
            <div className="flex w-full items-center justify-center">
              <GiveawayCard
                completedCount={completedCount}
                giveaway={giveaway}
                userId={userId}
                winner={winner}
                entry={entry}
              />
            </div>
          )}
        </div>
        {giveaway.giveaway_requirements && (
          <GiveawayRequirements
            requirements={giveaway.giveaway_requirements}
            setCompletedCount={setCompletedCount}
          />
        )}
        <ToastStyling />
      </div>
    </Wallet>
  );
}
