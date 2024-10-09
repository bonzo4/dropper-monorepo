"use client";

import GiveawayCard from "./GiveawayCard";
import { useGiveaways } from "@/lib/hooks/useGiveaways";
import { useState } from "react";
import PastGiveawayCard from "./PastGiveawayCard";
import GiveawayQuery from "./GiveawayQuery";
import { CgSpinner } from "react-icons/cg";
import PageNav from "@/components/PageNav";
import { LandingGiveawayQuery } from "@/lib/data/giveaway/getGiveaways";
import { createSupabaseClient } from "@repo/lib/supabase";

const Giveaways = () => {
  const supabase = createSupabaseClient();
  const [query, setQuery] = useState<LandingGiveawayQuery>({
    type: "ongoing",
    sort: "descending",
    sortBy: "created_at",
    page: 1,
  });

  const { giveaways, loading } = useGiveaways({
    supabase,
    query,
  });

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
    newSortBy:
      | "usd_value"
      | "end_time"
      | "entries"
      | "created_at"
      | "trending_score"
  ) => {
    if (query.sortBy === newSortBy) {
      if (query.sortBy === "trending_score") return;
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
    <div className="flex flex-col gap-5 px-4 lg:px-0 w-full lg:max-w-[1150px]">
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
      {!loading && (!query.type || query.type === "ongoing") && (
        <div className="relative flex flex-wrap justify-center lg:justify-start items-center text-text font-fff-forward grow gap-6 lg:space-y-0 pb-4">
          {giveaways.slice(0, 12).map((giveaway) => (
            <GiveawayCard key={giveaway.id} giveaway={giveaway} />
          ))}
        </div>
      )}
      {!loading && query.type === "past" && (
        <div className="relative flex flex-wrap justify-center lg:justify-start items-center text-text font-fff-forward grow gap-6 lg:space-y-0 pb-4">
          {giveaways.slice(0, 12).map((giveaway) => (
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
  );
};

export default Giveaways;
