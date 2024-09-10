import Tab from "@/components/ui/Tab";
import { headers } from "next/headers";
import { createSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Profile from "./components/Profile";
import ProfileStats from "./components/ProfileStats";
import { getProfilePageData } from "@/lib/data/profile/getProfilePage";
import { getGiveawayStats } from "@/lib/data/profile/getGiveawayStats";
import { getListingStats } from "@/lib/data/profile/getListingStats";
import { getUserPoints } from "@/lib/data/profile/getUserPoints";

export default async function ProfilePage() {
  const supabase = createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }
  const profileData = getProfilePageData({ supabase, userId: user.id });

  const giveawayStatsData = getGiveawayStats({ supabase, userId: user.id });
  const listingStatsData = getListingStats({ supabase, userId: user.id });
  const userPointsData = getUserPoints({ supabase, userId: user.id });

  const [profile, giveawayStats, listingStats, userPoints] = await Promise.all([
    profileData,
    giveawayStatsData,
    listingStatsData,
    userPointsData,
  ]);

  if (!profile) {
    redirect("/login");
  }

  return (
    <div className="flex grow justify-center py-20">
      <div className="flex flex-col gap-8 w-full max-w-[737px]">
        <Profile profile={profile} />
        <ProfileStats
          userPoints={userPoints}
          giveawayStats={giveawayStats}
          listingStats={listingStats}
        />
        {/* <Tab label="Connected Wallets"></Tab>
        <Tab label="Contributions"></Tab>
        <Tab label="Privacy"></Tab> */}
      </div>
    </div>
  );
}
