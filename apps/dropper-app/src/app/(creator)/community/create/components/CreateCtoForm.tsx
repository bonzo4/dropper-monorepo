"use client";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import { createSolGiveawayInstruction } from "@/lib/solana/instructions/createSolGiveaway";
import { createSplGiveawayInstruction } from "@/lib/solana/instructions/createSplGiveaway";
import { sendTransaction } from "@/lib/solana/sendTransaction";
import { createSupabaseClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils/classNames";
import { mono } from "@/lib/utils/fonts";
import {
  useConnection,
  useWallet,
  WalletContextState,
} from "@solana/wallet-adapter-react";
import { TransactionInstruction } from "@solana/web3.js";
import { ChangeEvent, useEffect, useState } from "react";
import { useIsMounted } from "usehooks-ts";
import { toast } from "react-toastify";
import {
  DEFAULT_GIVEAWAY,
  DEFAULT_GIVEAWAY_REQUIREMENTS,
  GiveawayInsert,
  GiveawayRequirementsInsert,
} from "@/lib/types/giveaway";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Solana, SolanaColor, Spl, SplColor } from "@/components/icons";
import { getDropperGiveaway } from "@/lib/solana/program";
import { createGiveaway } from "@/lib/actions/createGiveaway";
import { updateGiveawayTx } from "@/lib/actions/updateGiveawayTx";
import IconUpload from "./IconUpload";

type Props = {
  wallet: WalletContextState;
  mounted: () => boolean;
};

export default function CreateCtoForm({ wallet, mounted }: Props) {
  const supabase = createSupabaseClient();

  const [txString, setTxString] = useState<string | undefined>();
  const { connection } = useConnection();
  const [giveaway, setGiveaway] = useState<GiveawayInsert>(DEFAULT_GIVEAWAY);
  const [requirements, setRequirements] = useState<GiveawayRequirementsInsert>(
    DEFAULT_GIVEAWAY_REQUIREMENTS
  );
  const [giveawayType, setGiveawayType] = useState<"solana" | "spl">("solana");
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    const storedGiveaway = localStorage.getItem("cto");
    if (storedGiveaway) {
      setGiveaway({ ...JSON.parse(storedGiveaway) });
    } else {
      setGiveaway(DEFAULT_GIVEAWAY);
    }
  }, [setGiveaway]);

  useEffect(() => {
    if (JSON.stringify(giveaway) !== JSON.stringify(DEFAULT_GIVEAWAY)) {
      localStorage.setItem("cto", JSON.stringify(giveaway));
    }
  }, [setGiveaway, giveaway]);

  // const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   let giveawayId: number | undefined;
  //   setDisabled(true);
  //   try {
  //     if (!wallet.publicKey)
  //       throw new Error("Please connect a wallet to deploy your drop");
  //     const program = getDropperGiveaway(wallet, connection);
  //     if (!program) throw new Error("Program not found");
  //     let instruction: TransactionInstruction;
  //     checkGiveaway(giveaway, giveawayType);
  //     checkGiveawayRequirements(requirements);
  //     let response = await createGiveaway({
  //       giveaway: JSON.stringify(giveaway),
  //       requirements: JSON.stringify(requirements),
  //       giveawayType,
  //       creatorKey: wallet.publicKey.toBase58(),
  //     });
  //     const responseData = JSON.parse(response);
  //     if (responseData.status === "error") throw new Error(responseData.error);
  //     giveawayId = responseData.giveawayId;
  //     if (!giveawayId) throw new Error("Giveaway ID not found");
  //     if (giveawayType === "spl" && giveaway.token_address) {
  //       instruction = await createSplGiveawayInstruction({
  //         program,
  //         giveawayId,
  //         rewardAmount: giveaway.reward_amount,
  //         winnersAmount: giveaway.winner_amount,
  //         tokenAddress: giveaway.token_address,
  //       });
  //     } else {
  //       instruction = await createSolGiveawayInstruction({
  //         program,
  //         giveawayId,
  //         solanaAmount: giveaway.reward_amount,
  //         winnersAmount: giveaway.winner_amount,
  //       });
  //     }
  //     const tx = await sendTransaction({
  //       program,
  //       transactionInstructions: [instruction],
  //     });
  //     await updateGiveawayTx({
  //       tx,
  //       giveawayId: responseData.giveawayId,
  //     });
  //     setTxString(tx);
  //     toast.success(`Success:\nTX: ${tx}`, { autoClose: false });
  //   } catch (error: any) {
  //     if (giveawayId) {
  //       await supabase.from("giveaways").delete().eq("id", giveawayId);
  //     }
  //     toast.error(error.message, { autoClose: false });
  //   }

  //   setDisabled(false);
  // };

  const handleGiveawayChange = (key: string, value: string | number) => {
    setGiveaway({ ...giveaway, [key]: value });
  };

  return (
    <form
      className="flex flex-col gap-6 w-full px-4"
      // onSubmit={onSubmit}
    >
      <div className="flex flex-col gap-2 w-full">
        <h1 className="relative text-2xl md:text-[36px] py-5 ">CREATE CTO</h1>
        <div className="flex flex-col lg:flex-row gap-4 lg:justify-stretch">
          <IconUpload
            supabase={supabase}
            setGiveaway={setGiveaway}
            giveaway={giveaway}
          />
          <div className="flex flex-col grow gap-3">
            <Input
              placeholder="Token Title"
              value={giveaway.title}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleGiveawayChange("title", e.target.value)
              }
            />
            <Input
              placeholder="Token Ticker"
              value={giveaway.ticker}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleGiveawayChange("ticker", e.target.value)
              }
            />
            <TextArea
              placeholder="Description"
              value={giveaway.description}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                handleGiveawayChange("description", e.target.value)
              }
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full">
        <Input
          placeholder="Token Title"
          value={giveaway.title}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleGiveawayChange("title", e.target.value)
          }
        />
        <Input
          placeholder="Token Title"
          value={giveaway.title}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleGiveawayChange("title", e.target.value)
          }
        />
        <Input
          placeholder="Token Title"
          value={giveaway.title}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleGiveawayChange("title", e.target.value)
          }
        />
      </div>
      <div className="flex flex-col gap-2 w-full">
        <h1 className="relative text-2xl md:text-[36px] py-5 ">DEPLOY</h1>
        <div className="flex flex-col gap-4">
          <div className="flex flex-row items-center gap-4">
            <span className={cn(mono.className, "f")}>
              Giveaway cost: 0.1 SOL
            </span>

            {wallet.publicKey && (
              <Button className="" type="submit" disabled={disabled}>
                DEPLOY
              </Button>
            )}
            {mounted() && <WalletMultiButton />}
          </div>
        </div>
      </div>
    </form>
  );
}
