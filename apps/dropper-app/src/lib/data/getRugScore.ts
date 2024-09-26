export async function getRugScore(address: string) {
  const response = await fetch(
    `https://api.rugcheck.xyz/v1/tokens/${address}/report/summary`
  );

  if (!response.ok) {
    return JSON.stringify({
      status: "error",
      error: "Failed to get rug score",
    });
  }

  const data = await response.json();

  return data.score;
}
