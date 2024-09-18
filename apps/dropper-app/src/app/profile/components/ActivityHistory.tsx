"use client";
import PageNav from "@/components/PageNav";
import { useActivityHistory } from "@/lib/hooks/useActivityHistory";
import { createSupabaseClient } from "@repo/lib/supabase";
import { cn } from "@repo/ui/utils";
import { mono } from "@repo/ui/utils";
import { useState } from "react";
import { CgSpinner } from "react-icons/cg";

type Options = {
  userId: string;
};

export default function ActivityHistory({ userId }: Options) {
  const supabase = createSupabaseClient();
  const [page, setPage] = useState(1);
  const { activities, loading } = useActivityHistory({
    supabase,
    userId,
    page,
  });

  return (
    <div className="flex flex-col w-full gap-4 px-8">
      <h2 className="text-3xl">Activity History</h2>
      <div
        className={cn(
          mono.className,
          "flex flex-row gap-2 justify-between text-base font-bold"
        )}
      >
        <p>Activity</p>
        <p>Points</p>
      </div>
      {loading && (
        <div className="flex w-full justify-center">
          <CgSpinner size={75} className="animate-spin" />
        </div>
      )}
      {activities.length === 0 && !loading && (
        <div className="flex w-full py-7 justify-center">
          <p className="opacity-25 ">No account activity found</p>
        </div>
      )}
      {!loading && activities.length > 0 && (
        <ul className="flex flex-col gap-2 py-6">
          {activities.map((activity, index) => (
            <li
              key={activity.id}
              className={cn(
                mono.className,
                "flex flex-row gap-2 justify-between text-sm"
              )}
            >
              <p>
                {10 * (page - 1) + index + 1}.{" "}
                {new Date(activity.created_at).toLocaleDateString()}
                {" | "}
                {activity.activity}
              </p>
              <p>
                {activity.points > 0 ? "+" : ""}
                {activity.points}
              </p>
            </li>
          ))}
        </ul>
      )}
      <PageNav
        page={page}
        prevPage={() => setPage(page - 1)}
        nextPage={() => setPage(page + 1)}
        docCount={activities.length}
        maxDocs={10}
      />
    </div>
  );
}
