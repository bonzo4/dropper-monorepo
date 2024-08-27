/**
 * ! Executing this script will delete all data in your database and seed it with 10 whitelisted_wallets.
 * ! Make sure to adjust the script to your needs.
 * Use any TypeScript runner to run this script, for example: `npx tsx seed.ts`
 * Learn more about the Seed Client by following our guide: https://docs.snaplet.dev/seed/getting-started
 */
import { copycat, faker } from "@snaplet/copycat";
import { SupabaseClient, User } from "@supabase/supabase-js";
import { Database } from "./lib/types";

export async function createUsers(supabase: SupabaseClient<Database>) {
  const { data: { users }, error } = await supabase.auth.admin.listUsers();
  if (error) console.log(error);

  if (JSON.stringify(users) !== "[]") {
    await Promise.all(
      users.map(async (user: User) =>
        await supabase.auth.admin.deleteUser(user.id)
      ),
    );
  }

  const PASSWORD = "testuser";
  for (let i = 0; i < 5; i++) {
    const email = copycat.email(i).toLowerCase();
    const avatar = faker.image.avatarGitHub();
    const fullName = copycat.fullName(i);
    const userName = copycat.username(i);

    await supabase.auth.signUp({
      email,
      password: PASSWORD,
      options: {
        data: {
          avatar_url: avatar,
          name: fullName,
          user_name: userName,
        },
      },
    });
  }
}
