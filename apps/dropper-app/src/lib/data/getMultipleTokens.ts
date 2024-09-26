export async function getMultipleTokens(
  tokens: { token_address: string; ath: number }[]
) {
  const response = await fetch(
    `https://api.dexscreener.com/latest/dex/tokens/${tokens.map((token) => token.token_address).join(",")}`,
    {
      method: "GET",
      headers: {},
    }
  );
  if (!response.ok) {
    throw new Error("Failed to get token data");
  }

  const data = await response.json();

  const tokenData: { tokenAddress: string; atv: number; ath: number }[] = [];

  for (const token of tokens) {
    const tokenPair = data.pairs.find(
      (pair: any) => pair.baseToken.address === token.token_address
    );
    if (tokenPair) {
      tokenData.push({
        tokenAddress: token.token_address,
        atv: tokenPair.volume.m5,
        ath: token.ath > tokenPair.priceUsd ? token.ath : tokenPair.priceUsd,
      });
    }
  }

  return tokenData;
}
