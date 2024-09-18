import GiveawayPageNav from "@/components/PageNav";
import { useGiveaways } from "@/lib/hooks/useGiveaways";
import { cn } from "@repo/ui/utils";
import { mono } from "@repo/ui/utils";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PublicKey } from "@solana/web3.js";
import { useRef, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import PageNav from "@/components/PageNav";
import GiveawayCard from "@/app/components/GiveawayCard";
import GiveawayQuery from "@/app/components/GiveawayQuery";
import PastGiveawayCard from "@/app/components/PastGiveawayCard";
import { LandingGiveawayQuery } from "@/lib/data/giveaway/getGiveaways";
import { SupabaseClient } from "@supabase/supabase-js";
import { DatabaseTypes } from "@repo/app-types/database";

type Props = {
  publicKey: PublicKey;
  supabase: SupabaseClient<DatabaseTypes>;
};

export default function ManageGiveaways({ publicKey, supabase }: Props) {
  const [query, setQuery] = useState<LandingGiveawayQuery>({
    type: "ongoing",
    sort: "descending",
    sortBy: "created_at",
    page: 1,
  });

  const { giveaways, loading } = useGiveaways({
    query,
    supabase,
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
    setQuery((prev) => ({
      ...prev,
      type: newType,
      sort: "descending",
      sortBy: "created_at",
      page: 1,
    }));
  };

  const handleOrder = (
    newSortBy: "usd_value" | "end_time" | "entries" | "created_at"
  ) => {
    if (query.sortBy === newSortBy) {
      setQuery((prev) => ({
        ...prev,
        sort: query.sort === "ascending" ? "descending" : "ascending",
      }));
    } else {
      setQuery((prev) => ({
        ...prev,
        sort: "descending",
        sortBy: newSortBy,
        page: 1,
      }));
    }
  };

  const handlePrevPage = () => {
    setQuery((prev) => ({ ...prev, page: prev.page ? prev.page - 1 : 1 }));
  };

  const handleNextPage = () => {
    setQuery((prev) => ({ ...prev, page: prev.page ? prev.page + 1 : 2 }));
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
          query={query}
          handleType={handleType}
          handleOrder={handleOrder}
        />
        {giveaways.length === 0 && !loading && (
          <div className="flex w-full py-10 justify-center">
            <span className="opacity-25">No drops found</span>
          </div>
        )}
        {loading && (
          <div className="flex w-full py-10 justify-center">
            <CgSpinner size={75} className="animate-spin" />
          </div>
        )}
        {!loading && query.type === "ongoing" && (
          <div className="relative flex flex-wrap justify-start items-center text-text font-fff-forward grow  gap-6 lg:space-y-0 pb-4 ">
            {giveaways.map((giveaway) => (
              <GiveawayCard key={giveaway.id} giveaway={giveaway} />
            ))}
          </div>
        )}
        {!loading && query.type === "past" && (
          <div className="relative flex flex-wrap justify-center items-center text-text font-fff-forward grow  gap-6 lg:space-y-0 pb-4 ">
            {giveaways.map((giveaway) => (
              <PastGiveawayCard key={giveaway.id} giveaway={giveaway} />
            ))}
          </div>
        )}
        <PageNav
          page={query.page || 1}
          prevPage={handlePrevPage}
          nextPage={handleNextPage}
          docCount={giveaways.length}
          maxDocs={12}
        />
      </div>
    </div>
  );
}
