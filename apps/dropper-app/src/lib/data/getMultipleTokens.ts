export async function getMultipleTokens(addresses: string[]) {
  const response = await fetch(
    `https://api.dexscreener.com/latest/dex/tokens/${addresses.join(",")}`,
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

  for (const address of addresses) {
    const token = data.pairs.find(
      (pair: any) => pair.baseToken.address === address
    );
    if (token) {
      tokenData.push({
        tokenAddress: address,
        atv: token.volume.m5,
        ath: token.priceUsd,
      });
    }
  }

  return tokenData;
}
