export async function getMultipleTokenPrice(
  tokens: { token_address: string | null; reward_amount: number }[]
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

  const tokenData: { tokenAddress: string; price: number }[] = [];

  for (const token of tokens) {
    if (!token.token_address) continue;
    const tokenPair = data.pairs.find(
      (pair: any) => pair.baseToken.address === token.token_address
    );
    if (tokenPair) {
      tokenData.push({
        tokenAddress: token.token_address,
        price: tokenPair.priceUsd * token.reward_amount,
      });
    }
  }

  return tokenData;
}
