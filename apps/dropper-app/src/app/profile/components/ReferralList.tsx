"use client";

import PageNav from "@/components/PageNav";
import Button from "@/components/ui/Button";
import { useReferralList } from "@/lib/hooks/useReferralList";
import { createSupabaseClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils/classNames";
import { mono } from "@/lib/utils/fonts";
import { useState } from "react";
import { CgSpinner } from "react-icons/cg";

type Options = {
  userId: string;
};

export default function ReferralList({ userId }: Options) {
  const supabase = createSupabaseClient();
  const [referralType, setReferralType] = useState<
    "direct" | "secondary" | "tertiary"
  >("direct");
  const [page, setPage] = useState(1);

  const { referrals, loading } = useReferralList({
    supabase,
    userId,
    type: referralType,
    page,
  });

  return (
    <div className="flex flex-col w-full gap-4 px-8">
      <h2 className="text-3xl">Referral List</h2>
      <div className="flex flex-row gap-1">
        <Button
          onClick={() => setReferralType("direct")}
          disabled={referralType === "direct"}
        >
          Direct
        </Button>
        <Button
          onClick={() => setReferralType("secondary")}
          disabled={referralType === "secondary"}
        >
          Secondary
        </Button>
        <Button
          onClick={() => setReferralType("tertiary")}
          disabled={referralType === "tertiary"}
        >
          Tertiary
        </Button>
      </div>
      <div
        className={cn(
          mono.className,
          "flex flex-row gap-2 justify-between text-base font-bold"
        )}
      >
        <p>Date</p>
        <p>Points</p>
      </div>
      {loading && (
        <div className="flex w-full justify-center">
          <CgSpinner size={75} className="animate-spin" />
        </div>
      )}
      {referrals.length === 0 && !loading && (
        <div className="flex w-full py-6 justify-center">
          <p className="opacity-25 ">No referrals found</p>
        </div>
      )}
      {!loading && referrals.length > 0 && (
        <ul className="flex flex-col gap-2">
          {referrals.map((referral, index) => (
            <li
              key={referral.user_id}
              className={cn(
                mono.className,
                "flex flex-row gap-2 justify-between text-sm"
              )}
            >
              <p className="text-nowrap w-[200px] truncate overflow-hidden">
                {10 * (page - 1) + index + 1}.{" "}
                {new Date(referral.created_at).toLocaleDateString()}{" "}
                <span className="">{referral.user}</span>
              </p>
              <p>
                {referralType === "direct"
                  ? 100
                  : referralType === "secondary"
                    ? 40
                    : 10}
              </p>
            </li>
          ))}
        </ul>
      )}
      <PageNav
        page={page}
        prevPage={() => setPage(page - 1)}
        nextPage={() => setPage(page + 1)}
        docCount={referrals.length}
        maxDocs={10}
      />
    </div>
  );
}
