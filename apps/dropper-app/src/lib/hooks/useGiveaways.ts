import { DatabaseTypes } from "@repo/app-types/database";
import { SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import {
  getGiveaways,
  LandingGiveaway,
  LandingGiveawayQuery,
} from "../data/giveaway/getGiveaways";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Options = {
  supabase: SupabaseClient<DatabaseTypes>;
  query: LandingGiveawayQuery;
};

export function useGiveaways({ supabase, query }: Options) {
  const [loading, setLoading] = useState(false);
  const [giveaways, setGiveaways] = useState<LandingGiveaway[]>([]);

  const [queryRef, setQueryRef] = useState(JSON.stringify(query));

  useEffect(() => {
    setQueryRef(JSON.stringify(query));
  }, [query]);

  useEffect(() => {
    const fetchGiveaways = async () => {
      setLoading(true);
      const giveawaysData = await getGiveaways({
        supabase,
        query: JSON.parse(queryRef),
      });
      setGiveaways(giveawaysData);
      setLoading(false);
    };

    fetchGiveaways();
  }, [queryRef, supabase]);

  return { giveaways, loading } as const;
}
