"use client";
import { useEffect, useState } from "react";
import { createSupabaseClient } from "@repo/lib/supabase";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@repo/ui";
import Link from "next/link";
import { getDiscord } from "@/lib/actions/profile/getDiscord";
import { createDiscordAccount } from "@/lib/actions/profile/createDiscordAccount";
import { getTwitter } from "@/lib/actions/profile/getTwitter";

export default function TwitterCallback() {
  const router = useRouter();
  const supabase = createSupabaseClient();
  const searchParams = useSearchParams();

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function connectDiscord() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const code = searchParams.get("code");
      const state = searchParams.get("state");

      if (!user) {
        router.push("/login");
        return;
      }

      if (!code || !state) {
        setError("Missing code");
        return;
      }

      const twitterAccount = await getTwitter({
        code,
        codeVerifier:
          "r9PeebMI3VSsi5DvhYikTqa6-3xAgGhZ~z_B6Qfy.3jyb2zwxqAGwvUipUZThWRdd72SJnTYJuc1GAKaPfpeM6fFGLX_t_UYylXRjqFrknrfr5FCNcD~9Ky4XuD~NK59",
      });

      console.log(twitterAccount);

      // const discordResponse = await getDiscord({ code });
      // console.log(discordResponse);

      // const discordAccount = await JSON.parse(discordResponse);

      // if (!discordAccount.id) {
      //   setError("Failed to get discord user");
      //   return;
      // }

      // await createDiscordAccount({
      //   userId: user.id,
      //   discordId: discordAccount.id,
      //   username: discordAccount.username,
      // });

      // router.push("/profile");
    }

    connectDiscord();
  }, [router, searchParams, supabase]);

  return (
    <main className="flex w-full grow items-center justify-center">
      <div className="flex flex-col gap-2 items-center justify-center px-10">
        <h1 className="text-3xl">Connecting twitter, please wait...</h1>
      </div>
    </main>
  );
}
