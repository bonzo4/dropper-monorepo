"use server";

import { createSupabaseServer } from "@repo/lib/supabase";
import TwitterApi from "twitter-api-v2";

type Options = {
  code: string;
  userId: string;
};

export async function getTwitter({ code, userId }: Options) {
  const supabase = await createSupabaseServer();
  const client = new TwitterApi({
    clientId: process.env.TWITTER_CLIENT_ID!,
  });

  const { data, error } = await supabase
    .from("twitter_accounts")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) throw new Error(error.message);
  if (!data.code_verifier) throw new Error("No code verifier found");

  console.log(data.code_verifier);

  const { client: userClient } = await client.loginWithOAuth2({
    code,
    codeVerifier: data.code_verifier,
    redirectUri: `${process.env.NEXT_PUBLIC_URL}/auth/callback/twitter`,
  });

  const user = await userClient.currentUserV2();

  console.log(user);

  return JSON.stringify({
    username: user.data.username,
    id: user.data.id,
  });
}
