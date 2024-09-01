import { cn } from "@/lib/utils/classNames";
import { mono } from "@/lib/utils/fonts";
import { NotificationIcon, Confetti, Eyes } from "@repo/ui/Icons";
import Countdown from "react-countdown";
import Button from "@repo/ui/Button";
import { GiveawayEntryRow } from "@repo/types/giveaway";
import { WalletContextState } from "@solana/wallet-adapter-react";
import {
  WalletConnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { useState } from "react";
import { enterGiveaway } from "@/lib/actions/enterGiveaway";
import { User } from "@supabase/supabase-js";
import { GiveawayPageData } from "@/app/api/giveaways/[id]/route";
import { getRequirementCount } from "@/lib/utils/getRequirementCount";
import { toast } from "react-toastify";

type GiveawayEnterOptions = {
  endDate: Date;
  wallet: WalletContextState;
  user: User | null;
  giveaway: GiveawayPageData;
  completedCount: number;
};

export default function GiveawayEnter({
  endDate,
  wallet,
  user,
  giveaway,
  completedCount,
}: GiveawayEnterOptions) {
  const reqCount = getRequirementCount(giveaway.giveaway_requirements);

  const renderer = ({ days, hours, minutes, seconds, completed }: any) => {
    const dayHours = days * 24;
    hours = hours + dayHours;
    if (completed) {
      // Render a completed state
      return (
        <span className={cn(mono.className, "text-primary font-semibold")}>
          00:00:00
        </span>
      );
    } else {
      return (
        <span
          className={cn(mono.className, "text-primary font-semibold")}
          suppressHydrationWarning={true}
          style={{
            color:
              hours === 0 && minutes <= 9
                ? "#ff2e2f"
                : hours === 0 && minutes <= 29
                  ? "#ff822e"
                  : hours === 0 && minutes <= 49
                    ? "#ffcb2e"
                    : undefined,
          }}
        >
          {hours < 10 ? `0${hours}` : hours}:
          {minutes < 10 ? `0${minutes}` : minutes}:
          {seconds < 10 ? `0${seconds}` : seconds}
        </span>
      );
    }
  };

  const submitEntry = async () => {
    try {
      if (!user) throw new Error("Please login to enter this giveaway");
      if (!wallet.publicKey)
        throw new Error("Please connect your wallet to enter");
      if (!wallet.signMessage)
        throw new Error("Please connect your wallet to enter");
      if (reqCount != completedCount)
        throw new Error("Please complete all requirements");
      const encodedMessage = new TextEncoder().encode(
        "By entering this giveaway, I agree to the terms and conditions."
      );
      await wallet.signMessage(encodedMessage);
      const response = await enterGiveaway({
        userId: user.id,
        giveawayId: giveaway.id,
        walletKey: wallet.publicKey.toBase58(),
      });
      const data = JSON.parse(response);
      if (data.status != "ok")
        throw new Error("Something went wrong entering this drop.");

      toast.success("Successfully Entered Drop!");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="relative flex flex-col items-center w-[300px] md:w-[570px] border-2 border-primary rounded-md p-4 gap-5">
      <div className="flex w-full justify-end">
        <NotificationIcon width={26} height={20} />
      </div>
      <Eyes width={80} height={74} />
      <span className="text-xl">YOU COULD WIN!</span>
      <span className="text-base text-primary">ENTER NOW!</span>
      <div className="flex flex-row items-center gap-6 border-2 border-primary rounded-md p-2">
        <span className="text-sm">TIME LEFT TO ENTER</span>
        <Countdown date={endDate.getTime()} renderer={renderer} />
        {wallet.publicKey ? (
          <Button disabled={reqCount !== completedCount} onClick={submitEntry}>
            ENTER
          </Button>
        ) : (
          <WalletMultiButton />
        )}
      </div>
    </div>
  );
}
