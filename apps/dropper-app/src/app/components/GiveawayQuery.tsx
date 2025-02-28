import { Arrow, ArrowWhite } from "@repo/ui/icons";
import { LandingGiveawayQuery } from "@/lib/data/giveaway/getGiveaways";

type GiveawayQueryProps = {
  handleType: (type: "ongoing" | "past" | "not_started") => void;
  query: LandingGiveawayQuery;
  handleOrder: (
    sortBy:
      | "usd_value"
      | "end_time"
      | "entries"
      | "created_at"
      | "trending_score"
  ) => void;
  loading: boolean;
};

export default function GiveawayQuery({
  loading,
  handleType,
  query: { type = "ongoing", sortBy = "created_at", sort = "descending" },
  handleOrder,
}: GiveawayQueryProps) {
  return (
    <div className="flex flex-wrap lg:justify-start justify-center gap-3 tracking-wider text-sm sm:text-lg w-full ">
      <div className="flex flex-row gap-2 lg:gap-4">
        <button
          disabled={loading}
          className=""
          onClick={() => handleType("ongoing")}
          style={{
            color: type === "ongoing" ? "#00fdd0" : "#fff",
            opacity: type === "ongoing" ? "100%" : "25%",
          }}
        >
          ONGOING
        </button>
        {/* <button
          disabled={loading}
          className=""
          onClick={() => handleType("not_started")}
          style={{
            color: type === "not_started" ? "#00fdd0" : "#fff",
            opacity: type === "not_started" ? "100%" : "25%",
          }}
        >
          NOT STARTED
        </button> */}
        <button
          disabled={loading}
          className=""
          onClick={() => handleType("past")}
          style={{
            color: type === "past" ? "#00fdd0" : "#fff",
            opacity: type === "past" ? "100%" : "25%",
          }}
        >
          PAST DROPS
        </button>
      </div>
      <span className="text-white opacity-25 sm:flex hidden">|</span>
      <div className="sm:hidden flex w-full h-px bg-white opacity-25 mx-4" />

      <div className="flex flex-wrap justify-center px-12 lg:px-0 gap-2 lg:gap-4">
        <div className="flex flex-row gap-2">
          <button
            disabled={loading}
            className=""
            onClick={() => handleOrder("trending_score")}
            style={{
              color: sortBy === "trending_score" ? "#00fdd0" : "#fff",
              opacity: sortBy === "trending_score" ? "100%" : "25%",
              padding: sortBy === "trending_score" ? "0rem 0.5rem" : "",
            }}
          >
            TRENDING
          </button>
        </div>
        <div className="flex flex-row gap-2">
          <button
            disabled={loading}
            className=""
            onClick={() => handleOrder("created_at")}
            style={{
              color: sortBy === "created_at" ? "#00fdd0" : "#fff",
              opacity: sortBy === "created_at" ? "100%" : "25%",
            }}
          >
            NEWEST
          </button>
          {sortBy === "created_at" && (
            <div className="flex flex-col justify-center items-center gap-1">
              {sort === "ascending" ? (
                <Arrow height={8} className="-rotate-90" />
              ) : (
                <ArrowWhite height={8} className="-rotate-90 opacity-25" />
              )}
              {sort === "descending" ? (
                <Arrow height={8} className="rotate-90 mr-[1px]" />
              ) : (
                <ArrowWhite
                  height={8}
                  className="rotate-90 mr-[1px]  opacity-25"
                />
              )}
            </div>
          )}
        </div>
        <div className="flex flex-row gap-2">
          <button
            disabled={loading}
            className=""
            onClick={() => handleOrder("usd_value")}
            style={{
              color: sortBy === "usd_value" ? "#00fdd0" : "#fff",
              opacity: sortBy === "usd_value" ? "100%" : "25%",
            }}
          >
            VALUE
          </button>
          {sortBy === "usd_value" && (
            <div className="flex flex-col justify-center items-center gap-1">
              {sort === "ascending" ? (
                <Arrow height={8} className="-rotate-90" />
              ) : (
                <ArrowWhite height={8} className="-rotate-90  opacity-25" />
              )}
              {sort === "descending" ? (
                <Arrow height={8} className="rotate-90 mr-[1px]" />
              ) : (
                <ArrowWhite
                  height={8}
                  className="rotate-90 mr-[1px]  opacity-25"
                />
              )}
            </div>
          )}
        </div>
        <div className="flex flex-row gap-2">
          <button
            disabled={loading}
            className=""
            onClick={() => handleOrder("end_time")}
            style={{
              color: sortBy === "end_time" ? "#00fdd0" : "#fff",
              opacity: sortBy === "end_time" ? "100%" : "25%",
            }}
          >
            ENDING TIME
          </button>
          {sortBy === "end_time" && (
            <div className="flex flex-col justify-center items-center gap-1">
              {sort === "ascending" ? (
                <Arrow height={8} className="-rotate-90" />
              ) : (
                <ArrowWhite height={8} className="-rotate-90  opacity-25" />
              )}
              {sort === "descending" ? (
                <Arrow height={8} className="rotate-90  mr-[1px] " />
              ) : (
                <ArrowWhite
                  height={8}
                  className="rotate-90 mr-[1px]  opacity-25"
                />
              )}
            </div>
          )}
        </div>
        <div className="flex flex-row gap-2">
          <button
            disabled={loading}
            className=""
            onClick={() => handleOrder("entries")}
            style={{
              color: sortBy === "entries" ? "#00fdd0" : "#fff",
              opacity: sortBy === "entries" ? "100%" : "25%",
            }}
          >
            PARTICIPANTS
          </button>
          {sortBy === "entries" && (
            <div className="flex flex-col justify-center items-center gap-1">
              {sort === "ascending" ? (
                <Arrow height={8} className="-rotate-90" />
              ) : (
                <ArrowWhite height={8} className="-rotate-90  opacity-25" />
              )}
              {sort === "descending" ? (
                <Arrow height={8} className="rotate-90  mr-[1px]" />
              ) : (
                <ArrowWhite height={8} className="rotate-90  opacity-25" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
