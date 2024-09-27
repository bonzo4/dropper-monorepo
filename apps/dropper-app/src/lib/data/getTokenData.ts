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
    atv: data.pairs.reduce(
      (acc: number, pair: any) => acc + pair.volume.h24,
      0
    ),
    ath: data.pairs[0].priceUsd,
    total_supply: data.pairs[0].marketCap / data.pairs[0].priceUsd,
  };
}
