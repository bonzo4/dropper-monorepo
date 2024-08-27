import { LandingGiveaway } from "@/app/api/giveaways/route";
import { set } from "@coral-xyz/anchor/dist/cjs/utils/features";
import { useEffect, useState } from "react";

type Options = {
  initialGiveaways: LandingGiveaway[];
  type?: "ongoing" | "past" | "not_started";
  page?: number;
  sortBy?: "usd_value" | "end_time" | "entries" | "created_at";
  sort?: "ascending" | "descending";
  walletKey?: string;
};

export function useGiveaways({
  initialGiveaways,
  type = "ongoing",
  page = 1,
  sortBy = "created_at",
  sort = "descending",
  walletKey,
}: Options) {
  const [loading, setLoading] = useState(false);
  const [giveawayData, setGiveawayData] =
    useState<LandingGiveaway[]>(initialGiveaways);

  useEffect(() => {
    // Fetch new data only if necessary
    const fetchGiveaways = async () => {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/giveaways?page=${page}&type=${type}&sortBy=${sortBy}&sort=${sort}&walletKey=${walletKey}`,
        {
          cache: "no-cache",
        }
      );

      if (response.status !== 200) {
        setGiveawayData([]);
      } else {
        const data = (await response.json()) as LandingGiveaway[];
        setGiveawayData(data);
      }

      setLoading(false);
    };

    // Skip fetching on initial render if initialGiveaways is provided
    if (
      initialGiveaways &&
      page === 1 &&
      type === "ongoing" &&
      sortBy === "created_at" &&
      sort === "descending"
    ) {
      setGiveawayData(initialGiveaways);
      return;
    }

    fetchGiveaways();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, type, sortBy, sort, walletKey]);

  return { giveawayData, loading } as const;
}
