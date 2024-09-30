"use server";

import { createSupabaseServer } from "@repo/lib/supabase";
import { TwitterApi } from "twitter-api-v2";

export async function getTwitterOauthLink(userId: string) {
  const supabase = await createSupabaseServer();

  const client = new TwitterApi({
    clientId: process.env.TWITTER_CLIENT_ID!,
  });

  const authLink = client.generateOAuth2AuthLink(
    `${process.env.NEXT_PUBLIC_URL}/auth/callback/twitter`,
    { scope: ["users.read", "tweet.read"] }
  );

  await supabase.from("twitter_accounts").insert({
    user_id: userId,
    code_verifier: authLink.codeVerifier,
  });

  return authLink.url;
}
