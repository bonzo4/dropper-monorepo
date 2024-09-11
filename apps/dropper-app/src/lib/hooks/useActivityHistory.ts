import { UserActivity } from "@/lib/types/userActivity";
import { DatabaseTypes } from "@repo/app-types/database";
import { SupabaseClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";

type Options = {
  supabase: SupabaseClient<DatabaseTypes>;
  userId: string;
  page: number;
};

export function useActivityHistory({ supabase, userId, page }: Options) {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      setLoading(true);
      const query = supabase
        .from("user_activities")
        .select("*")
        .eq("user_id", userId);

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

      setActivities(data);
      setLoading(false);
    };

    fetchActivity();
  }, [supabase, userId, page]);

  return { activities, loading };
}
