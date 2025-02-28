export async function getTokenData(address: string) {
  const response = await fetch(
    `https://api.dexscreener.com/latest/dex/tokens/${address}`,
    {
      method: "GET",
      headers: {},
    }
  );
  if (!response.ok) {
    throw new Error("Failed to get token data");
  }

  const data = await response.json();

  if (!data.pairs.length) {
    throw new Error("No data found");
  }

  return {
    volume24h: data.pairs.reduce(
      (acc: number, pair: any) => acc + pair.volume.h24,
      0
    ),
    usdPrice: data.pairs[0].priceUsd,
    marketCap: data.pairs[0].marketCap,
  };
}
