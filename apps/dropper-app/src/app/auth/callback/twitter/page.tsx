"use client";
import { useEffect, useState } from "react";
import { createSupabaseClient } from "@repo/lib/supabase";
import { useSearchParams, useRouter } from "next/navigation";
import { getTwitter } from "@/lib/actions/profile/getTwitter";
import { createTwitterAccount } from "@/lib/actions/profile/createTwitterAccount";

export default function TwitterCallback() {
  const router = useRouter();
  const supabase = createSupabaseClient();
  const searchParams = useSearchParams();

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function connectTwitter() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const code = searchParams.get("code");

      if (!user) {
        router.push("/login");
        return;
      }

      if (!code) {
        setError("Missing code");
        return;
      }

      const twitterAccountData = await getTwitter({
        code,
        userId: user.id,
      });

      const twitterAccount = await JSON.parse(twitterAccountData);

      if (!twitterAccount.id) {
        setError("Failed to get twitter account");
        return;
      }

      await createTwitterAccount({
        userId: user.id,
        twitterId: twitterAccount.id,
        username: twitterAccount.username,
      });

      router.push("/profile");
    }

    connectTwitter();
  }, [router, searchParams, supabase]);

  return (
    <main className="flex w-full grow items-center justify-center">
      <div className="flex flex-col gap-2 items-center justify-center px-10">
        <h1 className="text-3xl">Connecting twitter, please wait...</h1>
      </div>
    </main>
  );
}
