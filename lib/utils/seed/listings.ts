import { SupabaseClient } from "@supabase/supabase-js";
import { copycat, faker } from "@snaplet/copycat";
import { DatabaseTypes } from "../../../packages/app-types/src/database";

export type ListingInsert =
  DatabaseTypes["public"]["Tables"]["listings"]["Insert"];

export async function createListings(
  supabase: SupabaseClient<DatabaseTypes>,
  userId: string
) {
  const listings: ListingInsert[] = [];
  for (let i = 0; i < 100; i++) {
    listings.push({
      description: faker.lorem.paragraph(),
      icon_url: faker.image.urlLoremFlickr({
        category: "icon",
        width: 100,
        height: 100,
      }),
      ticker: faker.lorem.word(),
      name: faker.lorem.words(),
      tx_string: faker.lorem.word(),
      usd_price: faker.number.float({
        min: 0,
        max: 1,
      }),
      volume_24h: faker.number.float({
        min: 0,
        max: 20_000_000,
      }),
      chain: "SOL",
      creator_key: faker.lorem.word(),
      holder_count: faker.number.int({
        min: 0,
        max: 20000,
      }),
      twitter_url: faker.internet.url(),
      telegram_url: faker.internet.url(),
      dexscreener_url: faker.internet.url(),
      created_at: faker.date.past().toISOString(),
      last_bump: faker.date.past().toISOString(),
      token_address: faker.lorem.words(),
      total_supply: faker.number.int({
        min: 0,
        max: 100_000_000,
      }),
      user_id: userId,
      is_cto: false,
    });
  }

  const { data, error } = await supabase
    .from("listings")
    .insert(listings)
    .select("id");

  if (error) {
    console.error(error);
    return;
  }

  console.log("listings created");
}
