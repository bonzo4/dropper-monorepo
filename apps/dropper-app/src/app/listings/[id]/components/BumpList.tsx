"use client";

import PageNav from "@/components/PageNav";
import { useBumps } from "@/lib/hooks/useBumps";
import { createSupabaseClient } from "@repo/lib/supabase";
import { cn, mono } from "@repo/ui/utils";
import { useState } from "react";
import { CgSpinner } from "react-icons/cg";

type Props = {
  listingId: number;
};

export default function BumpList({ listingId }: Props) {
  const supabase = createSupabaseClient();
  const [page, setPage] = useState(1);

  const { bumps, loading } = useBumps({ supabase, listingId, page });

  return (
    <div className="flex flex-col w-full gap-4 px-8">
      <h2 className="text-3xl">Recent Bumps</h2>
      <div
        className={cn(
          mono.className,
          "flex flex-row gap-2 justify-between text-base font-bold"
        )}
      >
        <p>Date</p>
      </div>
      {loading && (
        <div className="flex w-full justify-center">
          <CgSpinner size={75} className="animate-spin" />
        </div>
      )}
      {bumps.length === 0 && !loading && (
        <div className="flex w-full py-6 justify-center">
          <p className="opacity-25 ">No bumps found</p>
        </div>
      )}
      {!loading && bumps.length > 0 && (
        <ul className="flex flex-col gap-2 py-7">
          {bumps.slice(0, 10).map((bump, index) => (
            <li
              key={bump.user_id}
              className={cn(
                mono.className,
                "flex flex-row gap-2 justify-between text-sm"
              )}
            >
              <p className="text-nowrap w-[200px] truncate overflow-hidden">
                {10 * (page - 1) + index + 1}.{" "}
                <span className="">{bump.user}</span>
              </p>
              <p className="text-nowrap w-[200px] truncate overflow-hidden">
                {new Date(bump.created_at).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
      <PageNav
        page={page}
        prevPage={() => setPage(page - 1)}
        nextPage={() => setPage(page + 1)}
        docCount={bumps.length}
        maxDocs={10}
      />
    </div>
  );
}
