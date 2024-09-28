"use server";

import TwitterApi from "twitter-api-v2";

type Options = {
  code: string;
  codeVerifier: string;
};

export async function getTwitter({ code, codeVerifier }: Options) {
  const client = new TwitterApi({
    clientId: process.env.TWITTER_CLIENT_ID!,
  });

  const { client: userClient } = await client.loginWithOAuth2({
    code,
    codeVerifier,
    redirectUri: `${process.env.NEXT_PUBLIC_URL}/auth/callback/twitter`,
  });

  const user = await userClient.currentUserV2();

  console.log(user);

  return JSON.stringify({
    username: user.data.username,
    id: user.data.id,
  });
}
