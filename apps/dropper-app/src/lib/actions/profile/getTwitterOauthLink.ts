"use server";

import { TwitterApi } from "twitter-api-v2";

export async function getTwitterOauthLink() {
  const client = new TwitterApi({
    clientId: process.env.TWITTER_CLIENT_ID!,
  });

  const authLink = client.generateOAuth2AuthLink(
    `${process.env.NEXT_PUBLIC_URL}/auth/callback/twitter`,
    { scope: ["users.read", "tweet.read"] }
  );

  console.log(authLink.codeVerifier);

  return authLink.url;
}
