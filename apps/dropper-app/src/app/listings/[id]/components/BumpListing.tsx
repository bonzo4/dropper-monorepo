"use client";

import { Button } from "@repo/ui";
import { useState } from "react";
import { ListingBump } from "../../components/ListingBump";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getProvider } from "@/lib/solana/getProvider";
import { transferSolInstruction } from "@/lib/solana/instructions/transferSol";
import { sendTransaction } from "@/lib/solana/sendTransaction";
import { createListingBump } from "@/lib/actions/listings/createListingBump";
import { toast } from "react-toastify";

type Props = {
  listingId: number;
};

export default function BumpListing({ listingId }: Props) {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [showBumpModal, setShowBumpModal] = useState(false);
  const [bumpDisabled, setBumpDisabled] = useState(false);

  const showBump = () => {
    setShowBumpModal(true);
    return false;
  };

  const hideBump = () => {
    setShowBumpModal(false);
  };

  const bump = async (id: number) => {
    setBumpDisabled(true);
    try {
      if (!wallet.publicKey)
        throw new Error("Please connect a wallet to deploy your drop");
      const provider = getProvider(wallet, connection);
      const instruction = await transferSolInstruction({
        source: wallet.publicKey,
        solAmount: 0.001,
      });
      const tx = await sendTransaction({
        provider,
        transactionInstructions: [instruction],
      });

      await createListingBump({
        listingId: id,
        payerKey: wallet.publicKey.toBase58(),
        tx,
      });
      toast.success(`Bumped listing: ${tx}`);
      hideBump();
    } catch (error: any) {
      toast.error(error.message);
    }
    setBumpDisabled(false);
  };

  return (
    <div className="flex justify-end items-end mt-0 sm:mt-3">
      <Button className="text-[#FD00D0] border-[#FD00D0]" onClick={showBump}>
        Bump
      </Button>
      {showBumpModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <ListingBump
            listingId={listingId}
            hideBump={hideBump}
            bump={bump}
            wallet={wallet}
            bumpDisabled={bumpDisabled}
          />
        </div>
      )}
    </div>
  );
}
