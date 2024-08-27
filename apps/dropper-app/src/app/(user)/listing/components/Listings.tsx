"use client";

// import GiveawayCard from "./GiveawayCard";
// import { LandingGiveaway } from "../../api/giveaways/route";
import { useGiveaways } from "@/lib/hooks/useGiveaways";
import { useState } from "react";
// import PastGiveawayCard from "./PastGiveawayCard";
// import GiveawayQuery from "./GiveawayQuery";
// import GiveawayPageNav from "./GiveawayPageNav";
import { CgSpinner } from "react-icons/cg";

type Props = {} & React.HTMLAttributes<HTMLDivElement>;

export default function Listings({ ...props }: Props) {
  const [page, setPage] = useState(1);

  // const { giveawayData, loading } = useGiveaways({
  //   initialGiveaways: giveaways,
  //   type,
  //   sort,
  //   sortBy,
  //   page,
  // });

  return (
    <div className="flex flex-col gap-3 px-4 lg:px-0 w-full lg:max-w-[1150px]">
      {/* <GiveawayQuery
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
        <div
          {...props}
          className="relative flex flex-wrap justify-start items-center text-text font-fff-forward grow gap-6 lg:space-y-0 pb-4"
        >
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
        <div
          {...props}
          className="relative flex flex-wrap justify-center items-center text-text font-fff-forward grow gap-6 lg:space-y-0 pb-4"
        >
          {giveawayData.map((giveaway) => (
            <PastGiveawayCard
              key={giveaway.id}
              giveaway={giveaway}
              solValue={solValue}
            />
          ))}
        </div>
      )}
      <GiveawayPageNav
        page={page}
        setPage={setPage}
        giveawayCount={giveawayData.length}
      /> */}
    </div>
  );
}
