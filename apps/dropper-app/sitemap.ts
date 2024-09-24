import { getActiveGiveawayIds } from "@/lib/data/giveaway/getActiveGiveawayIds";
import { getListingIds } from "@/lib/data/listings/getListingIds";
import { createSupabaseServer } from "@repo/lib/supabase";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createSupabaseServer();
  const defaultPages: MetadataRoute.Sitemap = [
    {
      url: "/",
      priority: 1,
      lastModified: new Date(),
      changeFrequency: "daily",
    },
    {
      url: "/drops/create",
      priority: 0.7,
      lastModified: new Date(),
      changeFrequency: "never",
    },
    {
      url: "/drops/manage",
      priority: 0.7,
      lastModified: new Date(),
      changeFrequency: "never",
    },
    {
      url: "/listings",
      priority: 0.9,
      lastModified: new Date(),
      changeFrequency: "daily",
    },
    {
      url: "/listings/create",
      priority: 0.7,
      lastModified: new Date(),
      changeFrequency: "never",
    },
    {
      url: "/login",
      priority: 0.7,
      lastModified: new Date(),
      changeFrequency: "never",
    },
  ];

  const giveawaysData = getActiveGiveawayIds({ supabase });
  const listingData = getListingIds({ supabase });

  const [giveawayIds, listingIds] = await Promise.all([
    giveawaysData,
    listingData,
  ]);

  const sitemap = [
    ...defaultPages,
    ...giveawayIds.map((id) => ({
      url: `/giveaways/${id}`,
      priority: 0.8,
      lastModified: new Date(),
      changeFrequency: "daily" as "daily",
    })),
    ...listingIds.map((id) => ({
      url: `/listings/${id}`,
      priority: 0.8,
      lastModified: new Date(),
      changeFrequency: "daily" as "daily",
    })),
  ];

  return sitemap;
}
