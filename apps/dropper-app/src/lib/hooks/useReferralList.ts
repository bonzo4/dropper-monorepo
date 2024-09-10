import { DatabaseTypes } from "@repo/app-types/database";
import { SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import {
  DirectReferrals,
  SecondaryReferrals,
  TertiaryReferrals,
} from "../types/referrals";

type Options = {
  supabase: SupabaseClient<DatabaseTypes>;
  userId: string;
  type: "direct" | "secondary" | "tertiary";
  page: number;
};

export function useReferralList({ supabase, userId, type, page }: Options) {
  const [referrals, setReferrals] = useState<
    (DirectReferrals | SecondaryReferrals | TertiaryReferrals)[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReferrals = async () => {
      setLoading(true);
      const query = supabase
        .from(`${type}_referrals`)
        .select("*")
        .eq("referrer_id", userId);

      if (page > 1) {
        const start = (page - 1) * 10;
        const end = start + 10;
        query.range(start, end);
      } else {
        query.range(0, 10);
      }

      const { data, error } = await query;

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      console.log(data);

      setReferrals(data);
      setLoading(false);
    };

    fetchReferrals();
  }, [supabase, userId, type, page]);

  return { referrals, loading };
}
