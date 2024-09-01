"use client";
import { AirdropPreviewItem } from "@repo/types/airdrop";
import Input from "@repo/ui/Input";
import Button from "@repo/ui/Button";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAirdrops } from "@/lib/hooks/useAirdrops";
import { createSupabaseClient } from "@/lib/supabase/client";
import AirdropFilter from "./AirdropFilter";
import AirdropCard from "../../components/AirdropCard";
import AirdropListHeader from "./AirdropListHeader";
import AirdropListItem from "./AirdropListItem";

type AirdropListProps = {
  airdrops: AirdropPreviewItem[];
} & React.HTMLAttributes<HTMLDivElement>;

const AirdropList = ({ airdrops, ...props }: AirdropListProps) => {
  const supabase = createSupabaseClient();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [view, setView] = useState<"list" | "card">(
    (searchParams.get("view") as "list" | "card") || "list"
  );
  const [sort, setSort] = useState<string>(searchParams.get("sort") || "desc");
  const [sortBy, setSortBy] = useState<string>(
    searchParams.get("sortBy") || "created_at"
  );
  const [blockchain, setBlockchain] = useState<string | undefined>();
  const [category, setCategory] = useState<string | undefined>();
  const [search, setSearch] = useState<string | undefined>();

  const { currentAirdrops } = useAirdrops({
    supabase,
    airdrops,
    searchParams,
  });

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", view);
    router.push(pathname + "?" + params.toString());
  }, [pathname, router, searchParams, view]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sort);
    params.set("sortBy", sortBy);
    router.push(pathname + "?" + params.toString());
  }, [pathname, router, searchParams, sort, sortBy]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (blockchain) {
      params.set("blockchain", blockchain);
    } else {
      params.delete("blockchain");
    }
    router.push(pathname + "?" + params.toString());
  }, [pathname, router, searchParams, blockchain]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    router.push(pathname + "?" + params.toString());
  }, [pathname, router, searchParams, category]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }
    router.push(pathname + "?" + params.toString());
  }, [pathname, router, searchParams, search]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      setSearch(undefined);
      return;
    }
    setSearch(e.target.value);
  };

  return (
    <div
      {...props}
      className="self-stretch overflow-hidden flex flex-col items-center justify-start gap-[8px] text-[9px] lg:text-[10px]"
    >
      <div className="w-full overflow-hidden flex flex-col md:flex-row items-start justify-between gap-2">
        <Input placeholder="Search" value={search} onChange={handleSearch} />
        <div className="flex flex-row gap-1">
          <AirdropFilter
            blockchain={blockchain}
            setBlockchain={setBlockchain}
            category={category}
            setCategory={setCategory}
            setSort={setSort}
            sort={sort}
            setSortBy={setSortBy}
            sortBy={sortBy}
          />
          <Button
            onClick={() =>
              view === "list" ? setView("card") : setView("list")
            }
          >
            Switch View
          </Button>
        </div>
      </div>
      {view === "list" ? (
        <div className="self-stretch overflow-hidden flex flex-col items-center justify-start gap-[8px] text-[8px] lg:text-[10px]">
          <AirdropListHeader
            setSort={setSort}
            setSortBy={setSortBy}
            sort={sort}
            sortBy={sortBy}
          />
          <div className="w-full overflow-hidden flex flex-col items-start justify-start  text-primary">
            {currentAirdrops.map((airdrop, index) => (
              <AirdropListItem
                key={airdrop.id}
                airdrop={airdrop}
                index={index}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full self-stretch overflow-hidden flex flex-wrap items-center justify-center gap-[40px]">
          {currentAirdrops.map((airdrop) => (
            <AirdropCard key={airdrop.id} airdrop={airdrop} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AirdropList;
