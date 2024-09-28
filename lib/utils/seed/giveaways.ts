import { SupabaseClient } from "@supabase/supabase-js";
import { copycat, faker } from "@snaplet/copycat";
import { DatabaseTypes } from "../../../packages/app-types/src/database";

type GiveawayInsert = DatabaseTypes["public"]["Tables"]["giveaways"]["Insert"];
type GiveawayRequirementsInsert =
  DatabaseTypes["public"]["Tables"]["giveaway_requirements"]["Insert"];

export async function createGiveaways(
  supabase: SupabaseClient<DatabaseTypes>,
  userId: string
) {
  const giveaways: GiveawayInsert[] = [];
  for (let i = 0; i < 100; i++) {
    giveaways.push({
      description: faker.lorem.paragraph(),
      end_time: faker.date.future().toISOString(),
      icon_url: faker.image.urlLoremFlickr({
        category: "icon",
        width: 100,
        height: 100,
      }),
      reward_amount: faker.number.int({
        min: 0,
        max: 100,
      }),
      start_time: faker.date.past().toISOString(),
      ticker: faker.lorem.word({ length: 8 }),
      title: faker.lorem.words(),
      usd_value: faker.number.float({
        min: 0,
        max: 100,
      }),
      winner_amount: faker.number.int({
        min: 0,
        max: 10,
      }),
      tx_string: faker.lorem.words(),
      entries: faker.number.int({
        min: 0,
        max: 10000,
      }),
      created_at: faker.date.past().toISOString(),
      badges: ["SOL", "DEGEN_PUMP", "GOLD", "MOON", "PUMP_FUN", "TRENDING"],
      user_id: userId,
    });
  }

  const { data, error } = await supabase
    .from("giveaways")
    .insert(giveaways)
    .select("id");

  if (error) {
    console.error(error);
    return;
  }

  await Promise.all(
    data.map(async ({ id }) => {
      const giveawayRequirements: GiveawayRequirementsInsert = {
        giveaway_id: id,
        twitter_url: faker.internet.url(),
        tweet_url: faker.internet.url(),
        telegram_url: faker.internet.url(),
        discord_url: faker.internet.url(),
        dexscreener_url: faker.internet.url(),
        pumpdotfun_url: faker.internet.url(),
        moonshot_url: faker.internet.url(),
        moontok_url: faker.internet.url(),
      };
      await supabase.from("giveaway_requirements").insert(giveawayRequirements);
    })
  );

  console.log("giveaways created");
}
