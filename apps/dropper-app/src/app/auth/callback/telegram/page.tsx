"use client";
import { createSupabaseClient } from "@repo/lib/supabase";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function TelegramCallback() {
  const router = useRouter();
  const supabase = createSupabaseClient();
  const searchParams = useSearchParams();

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function connectDiscord() {
      router.push("/profile");
      // const {
      //   data: { user },
      // } = await supabase.auth.getUser();

      // const code = searchParams.get("code");

      // if (!user) {
      //   router.push("/login");
      //   return;
      // }

      // if (!code) {
      //   setError("Missing code");
      //   return;
      // }

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
        <h1 className="text-3xl">Connecting Telegram, please wait...</h1>
      </div>
    </main>
  );
}
