import { Notification, Confetti } from "@/components/icons";
import Button from "@/components/ui/Button";
import { claimGiveaway } from "@/lib/actions/claimGiveaway";
import { claimSolGiveawayInstruction } from "@/lib/solana/instructions/claimSolGiveaway";
import { claimSplGiveawayInstruction } from "@/lib/solana/instructions/claimSplGiveaway";
import { getDropperGiveaway } from "@/lib/solana/program";
import { sendTransaction } from "@/lib/solana/sendTransaction";
import { GiveawayWinnerRow } from "@/lib/types/giveaway";
import { cn } from "@/lib/utils/classNames";
import { mono } from "@/lib/utils/fonts";
import {
  useConnection,
  useWallet,
  WalletContextState,
} from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { User } from "@supabase/supabase-js";
import Countdown from "react-countdown";
import { toast } from "react-toastify";

type GiveawayWinnerProps = {
  giveawayId: number;
  tokenAddress: string | null;
  endDate: Date;
  winner: GiveawayWinnerRow;
  wallet: WalletContextState;
  user: User | null;
};

export default function GiveawayWinner({
  giveawayId,
  tokenAddress,
  endDate,
  winner,
  wallet,
  user,
}: GiveawayWinnerProps) {
  const { connection } = useConnection();
  const renderer = ({ days, hours, minutes, seconds, completed }: any) => {
    const dayHours = days * 24;
    hours = hours + dayHours;
    if (completed) {
      // Render a completed state
      return <span className={mono.className}>00:00:00</span>;
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

  const handleClaim = async () => {
    try {
      if (!winner) throw new Error("Sorry you are not a winner");
      const program = getDropperGiveaway(wallet, connection);
      if (!user) throw new Error("Please login to claim");
      if (!wallet.publicKey) throw new Error("Please connect a wallet");
      if (!program) throw new Error("Program not found");
      let instruction: TransactionInstruction;
      if (tokenAddress) {
        instruction = await claimSplGiveawayInstruction({
          program,
          giveawayId,
          mint: new PublicKey(tokenAddress),
        });
      } else {
        instruction = await claimSolGiveawayInstruction({
          program,
          giveawayId,
        });
      }

      const tx = await sendTransaction({
        program,
        transactionInstructions: [instruction],
      });

      const response = await claimGiveaway({
        userId: user.id,
        giveawayId,
      });

      const data = JSON.parse(response);

      if (data.status === "error") throw new Error(data.message);

      toast.success(`Success:\nTX: ${tx}`, { autoClose: false });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="relative flex flex-col items-center w-[300px] md:w-[570px] border-2 border-primary rounded-md p-4 gap-5">
      <div className="absolute top-1 right-2">
        <Notification width={26} height={20} />
      </div>
      <Confetti width={80} height={74} />
      <span className="text-xl">CONGRATULATIONS</span>
      <span className="text-base text-primary">YOW WON THE DROP</span>
      <div className="flex flex-row items-center gap-6 border-2 border-primary rounded-md p-2">
        <span className="text-sm">TIME LEFT TO CLAIM</span>
        <Countdown
          date={endDate.getTime() + 1000 * 60 * 60 * 24}
          renderer={renderer}
        />
        {wallet.publicKey ? (
          <Button onClick={handleClaim}>Claim</Button>
        ) : (
          <WalletMultiButton />
        )}
      </div>
    </div>
  );
}
