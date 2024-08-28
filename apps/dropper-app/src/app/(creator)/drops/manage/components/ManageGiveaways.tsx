import GiveawayCard from "@/app/(user)/components/GiveawayCard";
import GiveawayPageNav from "@/components/PageNav";
import GiveawayQuery from "@/app/(user)/components/GiveawayQuery";
import PastGiveawayCard from "@/app/(user)/components/PastGiveawayCard";
import { useGiveaways } from "@/lib/hooks/useGiveaways";
import { cn } from "@/lib/utils/classNames";
import { mono } from "@/lib/utils/fonts";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PublicKey } from "@solana/web3.js";
import { useRef, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import PageNav from "@/components/PageNav";

type Props = {
  publicKey: PublicKey;
};

export default function ManageGiveaways({ publicKey }: Props) {
  const [page, setPage] = useState(1);
  const [type, setType] = useState<"ongoing" | "past" | "not_started">(
    "ongoing"
  );
  const [sortBy, setSortBy] = useState<
    "usd_value" | "end_time" | "entries" | "created_at"
  >("created_at");
  const [sort, setSort] = useState<"ascending" | "descending">("descending");

  const { giveawayData, loading } = useGiveaways({
    initialGiveaways: [],
    walletKey: publicKey.toBase58(),
    type,
    sort,
    sortBy,
    page,
  });

  if (!publicKey)
    return (
      <div className="flex flex-col gap-[50px] grow items-center justify-start py-[50px]">
        <div className="flex flex-col gap-2 items-center">
          <h1 className="text-4xl">Manage DROPS</h1>
          <div className="flex flex-row gap-2">
            <span className={cn(mono.className, "text-[16px]")}>
              Connected Wallet:
            </span>
            <span className={cn(mono.className, "text-[16px], text-primary")}>
              None
            </span>
          </div>
        </div>
        <WalletMultiButton />
      </div>
    );

  const handleType = (newType: "ongoing" | "past" | "not_started") => {
    setSortBy("created_at");
    setSort("descending");
    setType(newType);
    setPage(1);
  };

  const handleOrder = (
    newSortBy: "usd_value" | "end_time" | "entries" | "created_at"
  ) => {
    if (sortBy === newSortBy) {
      setSort(sort === "ascending" ? "descending" : "ascending");
    } else {
      setSort("descending");
      setSortBy(newSortBy);
    }
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-[50px] items-center py-[50px] mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl">Manage DROPS</h1>
        <div className="flex flex-row gap-2">
          <span className={cn(mono.className, "text-[16px]")}>
            Connected Wallet:
          </span>
          <span className={cn(mono.className, "text-[16px], text-primary")}>
            {publicKey.toBase58().slice(0, 4)}...
            {publicKey.toBase58().slice(-4)}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-3 px-4 lg:px-0 lg:w-[1150px] lg:max-w-[1150px] ">
        <GiveawayQuery
          loading={loading}
          type={type}
          sortBy={sortBy}
          sort={sort}
          handleType={handleType}
          handleOrder={handleOrder}
        />
        {giveawayData.length === 0 && !loading && (
          <div className="flex w-full py-10 justify-center">
            <span className="opacity-25">No drops found</span>
          </div>
        )}
        {loading && (
          <div className="flex w-full py-10 justify-center">
            <CgSpinner size={75} className="animate-spin" />
          </div>
        )}
        {!loading && type === "ongoing" && (
          <div className="relative flex flex-wrap justify-start items-center text-text font-fff-forward grow  gap-6 lg:space-y-0 pb-4 ">
            {giveawayData.map((giveaway) => (
              <GiveawayCard
                key={giveaway.id}
                giveaway={giveaway}
                solValue={0}
              />
            ))}
          </div>
        )}
        {!loading && type === "past" && (
          <div className="relative flex flex-wrap justify-center items-center text-text font-fff-forward grow  gap-6 lg:space-y-0 pb-4 ">
            {giveawayData.map((giveaway) => (
              <PastGiveawayCard
                key={giveaway.id}
                giveaway={giveaway}
                solValue={0}
              />
            ))}
          </div>
        )}
        <PageNav
          page={page}
          setPage={setPage}
          docCount={giveawayData.length}
          maxDocs={12}
        />
      </div>
    </div>
  );
}
