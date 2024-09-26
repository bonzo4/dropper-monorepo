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
    const tokenPairs = data.pairs.filter(
      (pair: any) => pair.baseToken.address === token.token_address
    );
    if (!tokenPairs.length) continue;
    tokenData.push({
      tokenAddress: token.token_address,
      atv: tokenPairs.reduce(
        (acc: number, pair: any) => acc + pair.volume.h24,
        0
      ),
      ath:
        token.ath > tokenPairs[0].priceUsd ? token.ath : tokenPairs[0].priceUsd,
    });
  }

  return tokenData;
}
