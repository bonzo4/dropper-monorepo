import { transferSolInstruction } from "@/lib/solana/instructions/transferSol";
import { getDropperGiveaway } from "@/lib/solana/program";
import { sendTransaction } from "@/lib/solana/sendTransaction";
import { createSupabaseClient } from "@/lib/supabase/client";
import { DEFAULT_LISTING, ListingInsert } from "@/lib/types/listing";
import {
  useConnection,
  WalletContextState,
} from "@solana/wallet-adapter-react";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import ListingIconUpload from "./ListingIconUpload";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import { cn } from "@/lib/utils/classNames";
import { mono } from "@/lib/utils/fonts";
import { Solana, SolanaColor } from "@/components/icons";
import Button from "@/components/ui/Button";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { getProvider } from "@/lib/solana/getProvider";
import { checkListing } from "../utils/checkListing";
import { createListing } from "@/lib/actions/listings/createListing";

type Props = {
  wallet: WalletContextState;
  mounted: () => boolean;
};

export default function CreateListingForm({ wallet, mounted }: Props) {
  const supabase = createSupabaseClient();

  const [txString, setTxString] = useState<string | undefined>();
  const { connection } = useConnection();
  const [listing, setListing] = useState<ListingInsert>(DEFAULT_LISTING);
  const [disabled, setDisabled] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDisabled(true);
    try {
      if (!wallet.publicKey)
        throw new Error("Please connect a wallet to deploy your drop");
      checkListing(listing);
      const provider = getProvider(wallet, connection);
      const instruction = await transferSolInstruction({
        source: wallet.publicKey,
        solAmount: 0.5,
      });

      const tx = await sendTransaction({
        provider,
        transactionInstructions: [instruction],
      });
      await createListing({
        listing: JSON.stringify(listing),
        creatorKey: wallet.publicKey.toBase58(),
        tx: tx,
      });
      toast.success(`Listing created: ${tx}`);
    } catch (error: any) {
      toast.error(error.message, { autoClose: false });
    }

    setDisabled(false);
  };

  const handleListingChange = <K extends keyof ListingInsert>(
    key: K,
    value: ListingInsert[K]
  ) => {
    setListing((prev) => ({ ...prev, [key]: value }));
  };

  const handleListingLinkChange = <
    K extends keyof Pick<
      ListingInsert,
      "dexscreener_url" | "twitter_url" | "telegram_url"
    >,
  >(
    key: K,
    value: ListingInsert[K] | null // Allow null as the value type
  ) => {
    if (!value) return setListing((prev) => ({ ...prev, [key]: null }));
    setListing((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <form className="flex flex-col gap-6 w-full px-4" onSubmit={onSubmit}>
      <div className="flex flex-col gap-4 w-full">
        <h1 className="relative text-2xl md:text-[36px] py-5 ">
          CREATE LISTING
        </h1>
        <div className="flex flex-col lg:flex-row gap-4 lg:justify-stretch">
          <ListingIconUpload
            supabase={supabase}
            listing={listing}
            setListing={setListing}
          />
          <div className="flex flex-col grow gap-4">
            <Input
              placeholder="Token Name"
              value={listing.name}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleListingChange("name", e.target.value)
              }
            />
            <Input
              placeholder="Token Ticker"
              value={listing.ticker}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleListingChange("ticker", e.target.value)
              }
            />
            <TextArea
              className="min-h-[78px]"
              placeholder="Description"
              value={listing.description}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                handleListingChange("description", e.target.value)
              }
            />
          </div>
        </div>
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col lg:flex-row gap-2">
            <span className={cn(mono.className, "min-w-[152px]")}>
              X Account
            </span>
            <Input
              className="w-full"
              placeholder="@"
              value={listing.twitter_url || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleListingLinkChange("twitter_url", e.target.value)
              }
            />
          </div>
          <div className="flex flex-col lg:flex-row gap-2">
            <span className={cn(mono.className, "min-w-[152px]")}>
              Telegram Group
            </span>
            <Input
              className="w-full"
              placeholder="Telegram Link"
              value={listing.twitter_url || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleListingLinkChange("telegram_url", e.target.value)
              }
            />
          </div>
          <div className="flex flex-col lg:flex-row gap-2">
            <span className={cn(mono.className, "min-w-[152px]")}>
              Dexscreener
            </span>
            <Input
              className="w-full"
              placeholder="Dexscreener Link"
              value={listing.twitter_url || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleListingLinkChange("dexscreener_url", e.target.value)
              }
            />
          </div>
          <div className="flex flex-col lg:flex-row gap-4">
            <span className={cn(mono.className, "min-w-[152px]")}>Chain</span>
            <div className="flex flex-wrap gap-6">
              <div className="flex flex-row gap-4">
                <button
                  type="button"
                  className="flex flex-row gap-2 w-[126px] items-center"
                  onClick={() => handleListingChange("chain", "SOL")}
                  disabled={disabled}
                >
                  {listing.chain === "SOL" ? <SolanaColor /> : <Solana />}
                  <span
                    className={cn(mono.className, "")}
                    style={{
                      color: listing.chain === "SOL" ? "#00fdd0" : "",
                    }}
                  >
                    SOL
                  </span>
                </button>
              </div>
              <div className="flex flex-row gap-4">
                <button
                  type="button"
                  className="flex flex-row gap-2 w-[126px] items-center"
                  onClick={() => handleListingChange("chain", "TRON")}
                  disabled={disabled}
                >
                  {listing.chain === "TRON" ? <SolanaColor /> : <Solana />}
                  <span
                    className={cn(mono.className, "")}
                    style={{
                      color: listing.chain === "TRON" ? "#00fdd0" : "",
                    }}
                  >
                    TRON
                  </span>
                </button>
              </div>
              <div className="flex flex-col gap-4">
                <button
                  type="button"
                  className="flex flex-row gap-2 w-[126px] items-center"
                  onClick={() => handleListingChange("chain", "TON")}
                  disabled={disabled}
                >
                  {listing.chain === "TON" ? <SolanaColor /> : <Solana />}
                  <span
                    className={cn(mono.className, "")}
                    style={{
                      color: listing.chain === "TON" ? "#00fdd0" : "",
                    }}
                  >
                    TON
                  </span>
                </button>
              </div>
              <div className="flex flex-row gap-4">
                <button
                  type="button"
                  className="flex flex-row gap-2 w-[126px] items-center"
                  onClick={() => handleListingChange("chain", "ETH")}
                  disabled={disabled}
                >
                  {listing.chain === "ETH" ? <SolanaColor /> : <Solana />}
                  <span
                    className={cn(mono.className, "")}
                    style={{
                      color: listing.chain === "ETH" ? "#00fdd0" : "",
                    }}
                  >
                    ETH
                  </span>
                </button>
              </div>
              <div className="flex flex-row gap-4">
                <button
                  type="button"
                  className="flex flex-row gap-2 w-[126px] items-center"
                  onClick={() => handleListingChange("chain", "MATIC")}
                  disabled={disabled}
                >
                  {listing.chain === "MATIC" ? <SolanaColor /> : <Solana />}
                  <span
                    className={cn(mono.className, "")}
                    style={{
                      color: listing.chain === "MATIC" ? "#00fdd0" : "",
                    }}
                  >
                    MATIC
                  </span>
                </button>
              </div>
              <div className="flex flex-row gap-4">
                <button
                  type="button"
                  className="flex flex-row gap-2 w-[126px] items-center"
                  onClick={() => handleListingChange("chain", "BASE")}
                  disabled={disabled}
                >
                  {listing.chain === "BASE" ? <SolanaColor /> : <Solana />}
                  <span
                    className={cn(mono.className, "")}
                    style={{
                      color: listing.chain === "BASE" ? "#00fdd0" : "",
                    }}
                  >
                    BASE
                  </span>
                </button>
              </div>
              <div className="flex flex-row gap-4">
                <button
                  type="button"
                  className="flex flex-row gap-2 w-[126px] items-center"
                  onClick={() => handleListingChange("chain", "COSMOS")}
                  disabled={disabled}
                >
                  {listing.chain === "COSMOS" ? <SolanaColor /> : <Solana />}
                  <span
                    className={cn(mono.className, "")}
                    style={{
                      color: listing.chain === "COSMOS" ? "#00fdd0" : "",
                    }}
                  >
                    COSMOS
                  </span>
                </button>
              </div>
              <div className="flex flex-row gap-4">
                <button
                  type="button"
                  className="flex flex-row gap-2 w-[126px] items-center"
                  onClick={() => handleListingChange("chain", "BNB")}
                  disabled={disabled}
                >
                  {listing.chain === "BNB" ? <SolanaColor /> : <Solana />}
                  <span
                    className={cn(mono.className, "")}
                    style={{
                      color: listing.chain === "BNB" ? "#00fdd0" : "",
                    }}
                  >
                    BNB
                  </span>
                </button>
              </div>
              <div className="flex flex-row gap-4">
                <button
                  type="button"
                  className="flex flex-row gap-2 w-[126px] items-center"
                  onClick={() => handleListingChange("chain", "ADA")}
                  disabled={disabled}
                >
                  {listing.chain === "ADA" ? <SolanaColor /> : <Solana />}
                  <span
                    className={cn(mono.className, "")}
                    style={{
                      color: listing.chain === "ADA" ? "#00fdd0" : "",
                    }}
                  >
                    ADA
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-between gap-4">
          <span className={cn(mono.className)}>
            Dropboard listing fee: 0.5 SOL
          </span>
          <div className="flex flex-col lg:flex-row gap-2">
            {mounted() && <WalletMultiButton />}
            {wallet.publicKey && (
              <Button className="" type="submit" disabled={disabled}>
                LIST
              </Button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
