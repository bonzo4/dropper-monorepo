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

  if (!data.pairs[0]) {
    throw new Error("No data found");
  }

  return {
    atv: data.pairs[0].volume.m5,
    ath: data.pairs[0].priceUsd,
  };
}
