import { AirdropPreviewItem } from "@repo/types/airdrop";

export async function getAirdrops(searchParams: URLSearchParams) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/drops?${
      searchParams.toString() || "sort=desc&sortBy=created_at"
    }`,
    {
      cache: "no-cache",
    }
  );

  if (response.status !== 200) {
    throw new Error("Failed to fetch featured drops");
  }

  return (await response.json()) as AirdropPreviewItem[];
}
