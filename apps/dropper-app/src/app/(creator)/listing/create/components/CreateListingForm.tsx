import { createListing } from "@/lib/actions/createListing";
import { transferSolInstruction } from "@/lib/solana/instructions/transferSol";
import { getDropperGiveaway } from "@/lib/solana/program";
import { sendTransaction } from "@/lib/solana/sendTransaction";
import { createSupabaseClient } from "@/lib/supabase/client";
import { DEFAULT_LISTING, ListingInsert } from "@/lib/types/listing";
import {
  useConnection,
  WalletContextState,
} from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

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
      const program = getDropperGiveaway(wallet, connection);
      if (!program) throw new Error("Program not found");
      const instruction = await transferSolInstruction({
        source: wallet.publicKey,
        solAmount: 1,
      });

      const tx = await sendTransaction({
        program,
        transactionInstructions: [instruction],
      });

      await createListing({
        listing: JSON.stringify(listing),
        creatorKey: wallet.publicKey.toBase58(),
        tx: tx,
      });
    } catch (error: any) {
      toast.error(error.message, { autoClose: false });
    }

    setDisabled(false);
  };

  return (
    <form className="flex flex-col gap-6 w-full px-4" onSubmit={onSubmit}>
      <div className="flex flex-col gap-2 w-full">
        <h1 className="relative text-2xl md:text-[36px] py-5 ">
          CREATE LISTING
        </h1>
        <div className="flex flex-col lg:flex-row gap-4 lg:justify-stretch"></div>
      </div>
    </form>
  );
}
