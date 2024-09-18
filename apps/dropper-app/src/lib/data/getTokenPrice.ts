export async function getTokenPrice(
  address: string = "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN"
) {
  const response = await fetch(
    `https://public-api.birdeye.so/defi/price?address=${address}`,
    {
      method: "GET",
      headers: {
        "X-API-KEY": `${process.env.BIRDEYE_KEY}`,
      },
    }
  );

  if (!response.ok) {
    return JSON.stringify({
      status: "error",
      error: "Failed to get price",
    });
  }

  const data = await response.json();

  return data.data.value;
}
