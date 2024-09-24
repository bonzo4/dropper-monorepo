import { getActiveGiveawayIds } from "@/lib/data/giveaway/getActiveGiveawayIds";
import { getListingIds } from "@/lib/data/listings/getListingIds";
import { createSupabaseServer } from "@repo/lib/supabase";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createSupabaseServer();
  const defaultPages: MetadataRoute.Sitemap = [
    {
      url: "https://dropper.wtf/",
      priority: 1,
      lastModified: new Date(),
      changeFrequency: "daily",
    },
    {
      url: "https://dropper.wtf/drops/create",
      priority: 0.7,
      lastModified: new Date(),
      changeFrequency: "never",
    },
    {
      url: "https://dropper.wtf/drops/manage",
      priority: 0.7,
      lastModified: new Date(),
      changeFrequency: "never",
    },
    {
      url: "https://dropper.wtf/listings",
      priority: 0.9,
      lastModified: new Date(),
      changeFrequency: "daily",
    },
    {
      url: "https://dropper.wtf/listings/create",
      priority: 0.7,
      lastModified: new Date(),
      changeFrequency: "never",
    },
    {
      url: "https://dropper.wtf/login",
      priority: 0.7,
      lastModified: new Date(),
      changeFrequency: "never",
    },
    {
      url: "https://dropper.wtf/code",
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
      url: `https://dropper.wtf/drops/${id}`,
      priority: 0.8,
      lastModified: new Date(),
      changeFrequency: "daily" as "daily",
    })),
    ...listingIds.map((id) => ({
      url: `https://dropper.wtf/listings/${id}`,
      priority: 0.8,
      lastModified: new Date(),
      changeFrequency: "daily" as "daily",
    })),
  ];

  return sitemap;
}
