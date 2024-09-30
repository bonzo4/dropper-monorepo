export async function getMultipleTokenData(tokenAddresses: string[]) {
  const response = await fetch(
    `https://api.dexscreener.com/latest/dex/tokens/${tokenAddresses.join(",")}`,
    {
      method: "GET",
      headers: {},
    }
  );
  if (!response.ok) {
    throw new Error("Failed to get token data");
  }

  const data = await response.json();

  const tokenData: {
    tokenAddress: string;
    price: number;
    volume24h: number;
  }[] = [];

  for (const address of tokenAddresses) {
    const tokenPairs = data.pairs.filter(
      (pair: any) => pair.baseToken.address === address
    );
    if (!tokenPairs.length) continue;
    tokenData.push({
      tokenAddress: address,
      volume24h: tokenPairs.reduce(
        (acc: number, pair: any) => acc + pair.volume.h24,
        0
      ),
      price: tokenPairs[0].priceUsd,
    });
  }

  return tokenData;
}
