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
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  useEffect(() => {
    if (queryRef === JSON.stringify(query)) return;
    const urlQuery = new URLSearchParams(query as any);
    replace(`${pathname}?${urlQuery.toString()}`);
    setQueryRef(JSON.stringify(query));
  }, [pathname, query, queryRef, replace]);

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
