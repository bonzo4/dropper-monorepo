"use server";

import { TwitterApi } from "twitter-api-v2";

export async function getTwitterOauthLink() {
  const client = new TwitterApi({
    appKey: process.env.TWITTER_CONSUMER_KEY!,
    appSecret: process.env.TWITTER_CONSUMER_SECRET!,
  });

  const authLink = await client.generateAuthLink(
    `${process.env.NEXT_PUBLIC_URL}/auth/callback/twitter`
  );

  return authLink.url;
}
