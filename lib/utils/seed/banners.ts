import { SupabaseClient } from "@supabase/supabase-js";
import { copycat, faker } from "@snaplet/copycat";
import { DatabaseTypes } from "../../../packages/app-types/src/database";

export async function createBanners(supabase: SupabaseClient<DatabaseTypes>) {
  const giveawayBanners: { image_url: string; order: number }[] = [];

  for (let i = 0; i < 16; i++) {
    const image_url = faker.image.urlLoremFlickr();
    giveawayBanners.push({
      image_url,
      order: i,
    });
  }

  await supabase.from("giveaway_banners").insert(giveawayBanners);

  console.log("giveaway banners created");

  const listingBanners: { image_url: string; order: number }[] = [];

  for (let i = 0; i < 16; i++) {
    const image_url = faker.image.urlLoremFlickr();
    listingBanners.push({
      image_url,
      order: i,
    });
  }

  await supabase.from("listing_banners").insert(listingBanners);

  console.log("listing banners created");

  const airdropBanners: { image_url: string; order: number }[] = [];

  for (let i = 0; i < 16; i++) {
    const image_url = faker.image.urlLoremFlickr();
    airdropBanners.push({
      image_url,
      order: i,
    });
  }

  await supabase.from("airdrop_banners").insert(airdropBanners);

  console.log("airdrop banners created");
}
