import { SupabaseClient } from "@supabase/supabase-js";
import { copycat, faker } from "@snaplet/copycat";
import { DatabaseTypes } from "../../../packages/app-types/src/database";

export type AirdropInsert =
  DatabaseTypes["public"]["Tables"]["airdrops"]["Insert"];

export async function createAirdrops(supabase: SupabaseClient<DatabaseTypes>) {
  const airdrops: AirdropInsert[] = [];
  for (let i = 0; i < 100; i++) {
    const title = faker.lorem.words();
    airdrops.push({
      description: faker.lorem.paragraph(),
      icon_url: faker.image.urlLoremFlickr({
        category: "icon",
        width: 100,
        height: 100,
      }),
      title,
      twitter_url: faker.internet.url(),
      telegram_url: faker.internet.url(),
      created_at: faker.date.past().toISOString(),
      banner_url: faker.image.urlLoremFlickr(),
      blockchain: "SOL",
      difficulty: "easy",
      est_airdrop_size: faker.number.int({
        min: 0,
        max: 1000000,
      }),
      likelihood: faker.number.int({
        min: 0,
        max: 100,
      }),
      slug: title.toLowerCase().replace(/\s/g, "-"),
      symbol: faker.lorem.word(),
    });
  }

  const { data, error } = await supabase
    .from("airdrops")
    .insert(airdrops)
    .select("id");

  if (error) {
    console.error(error);
    return;
  }

  console.log("airdrops created");
}
