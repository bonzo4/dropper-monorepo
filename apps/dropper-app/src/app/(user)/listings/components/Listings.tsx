"use client";

import { ListingCardData } from "@/app/api/listings/route";
import { useListings } from "@/lib/hooks/useListings";
import { useState } from "react";
import { CgSpinner } from "react-icons/cg";
import ListingCard from "./ListingCard";
import PageNav from "@/components/PageNav";
import { toast } from "react-toastify";
import { ListingBump } from "./ListingBump";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getProvider } from "@/lib/solana/getProvider";
import { transferSolInstruction } from "@/lib/solana/instructions/transferSol";
import { sendTransaction } from "@/lib/solana/sendTransaction";
import { createListingBump } from "@/lib/actions/createListingBump";

export default function Listings() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [page, setPage] = useState(1);
  const [showBumpModal, setShowBumpModal] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState<number | null>(
    null
  );
  const [bumpDisabled, setBumpDisabled] = useState(false);

  const { listingsData, loading } = useListings({
    page,
  });

  const showBump = (id: number) => {
    setSelectedListingId(id);
    setShowBumpModal(true);
    return false;
  };

  const hideBump = () => {
    setSelectedListingId(null);
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
        solAmount: 0.5,
      });
      const tx = await sendTransaction({
        provider,
        transactionInstructions: [instruction],
      });

      await createListingBump({
        listingId: id,
        payerKey: wallet.publicKey.toBase58(),
        tx: tx,
      });
      toast.success(`Bumped listing: ${tx}`);
      hideBump();
    } catch (error: any) {
      toast.error(error.message);
    }
    setBumpDisabled(false);
  };

  return (
    <div className="flex flex-col gap-3 px-4 lg:px-0 w-full lg:max-w-[1150px]">
      {showBumpModal && selectedListingId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <ListingBump
            listingId={selectedListingId}
            hideBump={hideBump}
            bump={bump}
            wallet={wallet}
            bumpDisabled={bumpDisabled}
          />
        </div>
      )}
      {listingsData.length === 0 && !loading && (
        <div className="flex w-full py-10 justify-center">
          <span className="opacity-25">No ctos found</span>
        </div>
      )}
      {loading && (
        <div className="flex w-full py-10 justify-center">
          <CgSpinner size={75} className="animate-spin" />
        </div>
      )}
      {!loading && (
        <div className="relative flex flex-wrap lg:justify-start items-center text-text font-fff-forward grow gap-5 lg:space-y-0 pb-4 justify-center">
          {listingsData.slice(0, 12).map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              showBump={showBump}
            />
          ))}
        </div>
      )}
      <PageNav
        page={page}
        setPage={setPage}
        docCount={listingsData.length}
        maxDocs={12}
      />
    </div>
  );
}
