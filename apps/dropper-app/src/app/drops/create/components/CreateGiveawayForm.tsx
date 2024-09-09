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
import GiveawayReqInputs from "./GiveawayReqInputs";
import { Solana, SolanaColor, Spl, SplColor } from "@/components/icons";
import { getDropperGiveaway } from "@/lib/solana/program";
import { checkGiveaway, checkGiveawayRequirements } from "../utils/checks";
import { createGiveaway } from "@/lib/actions/giveaways/createGiveaway";
import { updateGiveawayTx } from "@/lib/actions/giveaways/updateGiveawayTx";
import IconUpload from "./GiveawayIconUpload";
import { transferSolInstruction } from "@/lib/solana/instructions/transferSol";
import { GiveawayBadges } from "@/lib/types/enums";

type Props = {
  wallet: WalletContextState;
  mounted: () => boolean;
};

export default function CreateGiveawayForm({ wallet, mounted }: Props) {
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
    const storedGiveaway = localStorage.getItem("giveaway");
    if (storedGiveaway) {
      setGiveaway({ ...JSON.parse(storedGiveaway) });
    } else {
      setGiveaway(DEFAULT_GIVEAWAY);
    }
  }, [setGiveaway]);

  useEffect(() => {
    if (JSON.stringify(giveaway) !== JSON.stringify(DEFAULT_GIVEAWAY)) {
      localStorage.setItem("giveaway", JSON.stringify(giveaway));
    }
  }, [setGiveaway, giveaway]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let giveawayId: number | undefined;
    setDisabled(true);
    try {
      if (!wallet.publicKey)
        throw new Error("Please connect a wallet to deploy your drop");
      const program = getDropperGiveaway(wallet, connection);
      if (!program) throw new Error("Program not found");
      let instruction: TransactionInstruction;
      checkGiveaway(giveaway, giveawayType);
      checkGiveawayRequirements(requirements);
      let badges: GiveawayBadges[] = ["SOL"];
      if (requirements.pumpdotfun_url) badges.push("PUMP_FUN");
      if (requirements.moonshot_url) badges.push("MOON");
      if (requirements.degenpumpfun_url) badges.push("DEGEN_PUMP");
      let response = await createGiveaway({
        giveaway: JSON.stringify(giveaway),
        requirements: JSON.stringify(requirements),
        giveawayType,
        creatorKey: wallet.publicKey.toBase58(),
        badges,
      });
      const responseData = JSON.parse(response);
      if (responseData.status === "error") throw new Error(responseData.error);
      giveawayId = responseData.giveawayId;
      if (!giveawayId) throw new Error("Giveaway ID not found");
      if (giveawayType === "spl" && giveaway.token_address) {
        instruction = await createSplGiveawayInstruction({
          program,
          giveawayId,
          rewardAmount: giveaway.reward_amount,
          winnersAmount: giveaway.winner_amount,
          tokenAddress: giveaway.token_address,
        });
      } else {
        instruction = await createSolGiveawayInstruction({
          program,
          giveawayId,
          solanaAmount: giveaway.reward_amount,
          winnersAmount: giveaway.winner_amount,
        });
      }
      const payInstruction = await transferSolInstruction({
        source: wallet.publicKey,
        solAmount: 0.1,
      });
      const tx = await sendTransaction({
        provider: program.provider,
        transactionInstructions: [instruction, payInstruction],
      });
      const response2 = await updateGiveawayTx({
        tx,
        giveawayId: responseData.giveawayId,
      });
      const response2Data = JSON.parse(response2);
      if (response2Data.status === "error")
        throw new Error(response2Data.error);
      setTxString(tx);
      toast.success(`Success:\nTX: ${tx}`, { autoClose: false });
    } catch (error: any) {
      if (giveawayId) {
        await supabase.from("giveaways").delete().eq("id", giveawayId);
      }
      toast.error(error.message, { autoClose: false });
    }

    setDisabled(false);
  };

  const handleGiveawayChange = (key: string, value: string | number) => {
    setGiveaway({ ...giveaway, [key]: value });
  };

  const handleAddRequirements = (
    key: keyof Omit<GiveawayRequirementsInsert, "giveaway_id" | "created_at">
  ) => {
    const newRequirements = requirements;
    if (newRequirements[key] === null) newRequirements[key] = "";
    else newRequirements[key] = null;
    setRequirements({ ...newRequirements });
  };

  const handleRequirementsChange = (
    key: keyof Omit<GiveawayRequirementsInsert, "giveaway_id" | "created_at">,
    value: string
  ) => {
    setRequirements({ ...requirements, [key]: value });
  };

  const handleGiveawayTypeChange = (type: "solana" | "spl") => {
    setGiveawayType(type);
    if (type == "solana")
      setGiveaway({ ...giveaway, reward_amount: 0.1, token_address: null });
    else if (type == "spl")
      setGiveaway({ ...giveaway, reward_amount: 0, token_address: "" });
  };

  return (
    <form className="flex flex-col gap-6 w-full px-4" onSubmit={onSubmit}>
      <div className="flex flex-col gap-2 w-full">
        <h1 className="relative text-2xl md:text-[36px] py-5 ">CREATE DROP</h1>
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
        <span className="relative text-2xl md:text-[36px] py-5 ">REWARD</span>
        <div className="flex flex-col lg:flex-row gap-4 p-2.5">
          <span className={cn(mono.className, "min-w-[180px]")}>
            Reward Type
          </span>
          <div className="flex flex-row gap-4">
            <button
              type="button"
              className="flex flex-row gap-2 w-[126px] items-center"
              onClick={() => handleGiveawayTypeChange("solana")}
              disabled={disabled}
            >
              {giveawayType === "solana" ? <SolanaColor /> : <Solana />}
              <span
                className={cn(mono.className, "")}
                style={{
                  color: giveawayType === "solana" ? "#00fdd0" : "",
                }}
              >
                Solana
              </span>
            </button>
            <button
              type="button"
              className="flex flex-row gap-2 w-[126px] items-center"
              onClick={() => handleGiveawayTypeChange("spl")}
              disabled={disabled}
            >
              {giveawayType === "spl" ? <SplColor /> : <Spl />}
              <span
                className={cn(mono.className, "")}
                style={{
                  color: giveawayType === "spl" ? "#00fdd0" : "",
                }}
              >
                SPL
              </span>
            </button>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-4 p-2.5 w-full">
          <span className={cn(mono.className, "min-w-[180px]")}>
            Giveaway Amount
          </span>
          {giveawayType === "spl" && (
            <div className="flex flex-col gap-2 w-full">
              <Input
                placeholder="Custom Token Address"
                className="w-full"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleGiveawayChange("token_address", e.target.value)
                }
              />
              <Input
                placeholder="Custom Token Amount"
                className="w-full"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleGiveawayChange("reward_amount", e.target.value)
                }
              />
            </div>
          )}
          {giveawayType === "solana" && (
            <div className="flex flex-row gap-4">
              <Checkbox
                label="0.1 SOL"
                checked={giveaway.reward_amount === 0.1}
                onClick={() => handleGiveawayChange("reward_amount", 0.1)}
                disabled={disabled}
                type="button"
              />
              <Checkbox
                label="0.25 SOL"
                checked={giveaway.reward_amount === 0.25}
                onClick={() => handleGiveawayChange("reward_amount", 0.25)}
                disabled={disabled}
                type="button"
              />
              <Checkbox
                label="0.5 SOL"
                checked={giveaway.reward_amount === 0.5}
                onClick={() => handleGiveawayChange("reward_amount", 0.5)}
                disabled={disabled}
                type="button"
              />
            </div>
          )}
        </div>
      </div>
      <GiveawayReqInputs
        requirements={requirements}
        setRequirements={setRequirements}
        handleAddRequirements={handleAddRequirements}
        handleRequirementsChange={handleRequirementsChange}
      />
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
          <span className={cn(mono.className, "")}>
            All giveaways start in 5 minutes after purchase and end in 1 hour.
            There will be 5 winners.
          </span>
        </div>
      </div>
    </form>
  );
}
