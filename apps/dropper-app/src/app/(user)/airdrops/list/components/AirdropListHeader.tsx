import { Arrow } from "@/components/icons";

type AirdropListHeaderProps = {
  setSortBy: (sortBy: string) => void;
  sortBy: string;
  sort: string;
  setSort: (sort: string) => void;
} & React.HTMLAttributes<HTMLDivElement>;

const AirdropListHeader = ({
  setSortBy,
  sortBy,
  sort,
  setSort,
}: AirdropListHeaderProps) => {
  const handleSortBy = (
    newSortBy:
      | "title"
      | "est_airdrop_size"
      | "questers"
      | "sentiment"
      | "likelihood"
  ) => {
    if (newSortBy === sortBy) {
      if (sort === "asc") {
        setSort("desc");
      } else {
        setSort("asc");
      }
    } else {
      setSortBy(newSortBy);
      if (newSortBy === "title") {
        setSort("asc");
      } else {
        setSort("desc");
      }
    }
  };

  return (
    <div className="w-full rounded-md bg-secondary overflow-hidden flex flex-row items-center py-2.5 px-2 md:pr-5 lg:pl-10 border-[2px] border-solid border-primary gap-[4px]">
      <button
        className="w-[110px] md:w-[150px] lg:w-[220px]  flex flex-row items-center justify-center hover:bg-white rounded-sm hover:bg-opacity-25 py-1 hover:cursor-pointer gap-2"
        onClick={() => handleSortBy("title")}
      >
        <span className="relative">Token</span>
        {sortBy === "title" && sort === "asc" ? (
          <Arrow width={10} className="-rotate-90" />
        ) : sortBy === "title" && sort === "desc" ? (
          <Arrow width={10} className="rotate-90" />
        ) : null}
      </button>
      <div
        className="w-[68px] md:w-[90px] lg:w-[110px]  flex flex-row items-center justify-start hover:bg-white rounded-sm hover:bg-opacity-25 pl-1 py-1 hover:cursor-pointer gap-2"
        onClick={() => handleSortBy("est_airdrop_size")}
      >
        <span className="relative">Est. Airdrop</span>
        {sortBy === "est_airdrop_size" && sort === "asc" ? (
          <Arrow width={10} className="-rotate-90" />
        ) : sortBy === "est_airdrop_size" && sort === "desc" ? (
          <Arrow width={10} className="rotate-90" />
        ) : null}
      </div>
      <div
        className="w-[68px] md:w-[90px] lg:w-[110px]  flex flex-row items-center justify-start hover:bg-white rounded-sm hover:bg-opacity-25 pl-1 py-1 hover:cursor-pointer gap-2"
        onClick={() => handleSortBy("likelihood")}
      >
        <span className="relative">Likelihood</span>
        {sortBy === "likelihood" && sort === "asc" ? (
          <Arrow width={10} className="-rotate-90" />
        ) : sortBy === "likelihood" && sort === "desc" ? (
          <Arrow width={10} className="rotate-90" />
        ) : null}
      </div>
      <div
        className="w-[68px] md:w-[90px] lg:w-[110px] md:flex hidden flex-row items-center justify-start hover:bg-white rounded-sm hover:bg-opacity-25 pl-1 py-1 hover:cursor-pointer gap-2"
        onClick={() => handleSortBy("questers")}
      >
        <span className="relative">Questers</span>
        {sortBy === "questers" && sort === "asc" ? (
          <Arrow width={10} className="-rotate-90" />
        ) : sortBy === "questers" && sort === "desc" ? (
          <Arrow width={10} className="rotate-90" />
        ) : null}
      </div>
      <div
        className="w-[68px] md:w-[90px] lg:w-[110px] md:flex hidden flex-row items-center justify-start hover:bg-white rounded-sm hover:bg-opacity-25 pl-1 py-1 hover:cursor-pointer gap-2"
        onClick={() => handleSortBy("sentiment")}
      >
        <span className="relative">Sentiment</span>
        {sortBy === "sentiment" && sort === "asc" ? (
          <Arrow width={10} className="-rotate-90" />
        ) : sortBy === "sentiment" && sort === "desc" ? (
          <Arrow width={10} className="rotate-90" />
        ) : null}
      </div>
      <div className="w-[68px] md:w-[90px] lg:w-[110px]  md:flex hidden flex-row items-center justify-start ">
        <span className="relative">Category</span>
      </div>
      <div className="w-[68px] md:w-[90px] lg:w-[110px] flex flex-row items-center justify-start">
        <span className="relative">Blockchain</span>
      </div>
    </div>
  );
};

export default AirdropListHeader;
