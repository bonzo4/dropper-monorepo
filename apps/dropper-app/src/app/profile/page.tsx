import Tab from "@/components/ui/Tab";
import { headers } from "next/headers";
import { createSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Profile from "./components/Profile";
import ProfileStats from "./components/ProfileStats";
import { getProfilePageData } from "@/lib/data/getProfilePage";

export default async function ProfilePage() {
  const supabase = createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }
  const profile = await getProfilePageData({ supabase, userId: user.id });

  if (!profile) {
    redirect("/login");
  }

  return (
    <div className="flex grow justify-center py-20">
      <div className="flex flex-col gap-8 w-full max-w-[737px]">
        <Profile profile={profile} />
        <ProfileStats />
        <Tab label="Connected Wallets"></Tab>
        <Tab label="Contributions"></Tab>
        <Tab label="Privacy"></Tab>
      </div>
    </div>
  );
}
