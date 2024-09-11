import { createClient } from "@supabase/supabase-js";
import { createUsers } from "./users";
import { whitelistWallets } from "./wallets";
import { createCodes } from "./codes";
import { DatabaseTypes } from "@repo/app-types/database";
import { createBanners } from "./banners";
import { createGiveaways } from "./giveaways";
import { createListings } from "./listings";
import { createAirdrops } from "./airdrops";

require("dotenv").config();

const main = async () => {
  const supabase = createClient<DatabaseTypes>(
    process.env.SUPABASE_URL!,
    // Note you might want to use `SUPABASE_ROLE` key here with `auth.admin.signUp` if your app is using email confirmation
    process.env.SUPABASE_SERVICE_KEY!
  );

  await createUsers(supabase);

  let userId: string;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  userId = user?.id!;

  await supabase.auth.signOut();

  await createCodes(supabase);
  await whitelistWallets(supabase);
  await createBanners(supabase);
//   await createGiveaways(supabase, userId);
//   await createListings(supabase, userId);
//   await createAirdrops(supabase);

  console.log("Database seeded successfully!");

  process.exit();
};

main();
