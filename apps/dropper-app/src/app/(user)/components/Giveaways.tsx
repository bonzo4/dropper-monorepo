"use client";

import GiveawayCard from "./GiveawayCard";
import { LandingGiveaway } from "../../api/giveaways/route";
import { useGiveaways } from "@/lib/hooks/useGiveaways";
import { useState } from "react";
import PastGiveawayCard from "./PastGiveawayCard";
import GiveawayQuery from "./GiveawayQuery";
import { CgSpinner } from "react-icons/cg";
import PageNav from "@/components/PageNav";

type GiveawaysOptions = {
  giveaways: LandingGiveaway[];
  solValue: number;
} & React.HTMLAttributes<HTMLDivElement>;

const Giveaways = ({ giveaways, solValue, ...props }: GiveawaysOptions) => {
  const [page, setPage] = useState(1);
  const [type, setType] = useState<"ongoing" | "past" | "not_started">(
    "ongoing"
  );
  const [sortBy, setSortBy] = useState<
    "usd_value" | "end_time" | "entries" | "created_at"
  >("created_at");
  const [sort, setSort] = useState<"ascending" | "descending">("descending");

  const { giveawayData, loading } = useGiveaways({
    initialGiveaways: giveaways,
    type,
    sort,
    sortBy,
    page,
  });

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
    <div className="flex flex-col gap-3 px-4 lg:px-0 w-full lg:max-w-[1150px]">
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
        <div className="relative flex flex-wrap justify-start items-center text-text font-fff-forward grow gap-6 lg:space-y-0 pb-4">
          {giveawayData.map((giveaway) => (
            <GiveawayCard
              key={giveaway.id}
              giveaway={giveaway}
              solValue={solValue}
            />
          ))}
        </div>
      )}
      {!loading && type === "past" && (
        <div className="relative flex flex-wrap justify-start items-center text-text font-fff-forward grow gap-6 lg:space-y-0 pb-4">
          {giveawayData.map((giveaway) => (
            <PastGiveawayCard
              key={giveaway.id}
              giveaway={giveaway}
              solValue={solValue}
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
  );
};

export default Giveaways;
