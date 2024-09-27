"use server";
type Options = {
  code: string;
};

export async function getDiscord({ code }: Options) {
  const tokenResponseData = await fetch(
    "https://discord.com/api/oauth2/token",
    {
      method: "POST",
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID!,
        client_secret: process.env.DISCORD_CLIENT_SECRET!,
        code,
        grant_type: "authorization_code",
        redirect_uri: `http://localhost:${3000}/auth/callback/discord`,
        scope: "identify",
      }).toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  const oauthData = await tokenResponseData.json();

  const userResponse = await fetch("https://discord.com/api/users/@me", {
    headers: {
      authorization: `${oauthData.token_type} ${oauthData.access_token}`,
    },
  });

  const userData = await userResponse.json();

  return JSON.stringify({
    username: userData.username,
    id: userData.id,
  });
}
