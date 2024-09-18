import { Tab } from "@repo/ui";
import { createSupabaseServer } from "@repo/lib/supabase";
import { redirect } from "next/navigation";
import Profile from "./components/Profile";
import ProfileStats from "./components/ProfileStats";
import { getProfilePageData } from "@/lib/data/profile/getProfilePage";
import { getGiveawayStats } from "@/lib/data/profile/getGiveawayStats";
import { getListingStats } from "@/lib/data/profile/getListingStats";
import { getUserPoints } from "@/lib/data/profile/getUserPoints";
import ReferralProgram from "./components/ReferralProgram";
import ReferralList from "./components/ReferralList";
import ActivityHistory from "./components/ActivityHistory";
import ConnectDiscord from "./components/ConnectDiscord";
import { getDiscordAccount } from "@/lib/data/profile/getDiscordAccount";
import ConnectSolanaWallet from "./components/ConnectSolanaWallet";
import { getSolanaWallet } from "@/lib/data/profile/getSolanaAccount";
import ConnectTwitter from "./components/ConnectTwitter";

export default async function ProfilePage() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }
  const profileData = getProfilePageData({ supabase, userId: user.id });

  const discordAccountData = getDiscordAccount({ supabase, userId: user.id });
  const solanaWalletData = getSolanaWallet({ supabase, userId: user.id });
  const giveawayStatsData = getGiveawayStats({ supabase, userId: user.id });
  const listingStatsData = getListingStats({ supabase, userId: user.id });
  const userPointsData = getUserPoints({ supabase, userId: user.id });

  const [
    profile,
    discordAccount,
    solanaWallet,
    giveawayStats,
    listingStats,
    userPoints,
  ] = await Promise.all([
    profileData,
    discordAccountData,
    solanaWalletData,
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
        <Tab label="Connections" className="flex flex-col gap-5">
          <ConnectDiscord discordAccount={discordAccount} />
          <ConnectTwitter discordAccount={null} />
          <ConnectSolanaWallet solanaWallet={solanaWallet} userId={user.id} />
        </Tab>
        <Tab label="Referral Program" className="flex flex-col gap-5">
          <ReferralProgram referral_id={profile.referral_id} />
          <ReferralList userId={user.id} />
        </Tab>
        <Tab label="Activity History" className="w-full flex flex-col gap-5">
          <ActivityHistory userId={user.id} />
        </Tab>
      </div>
    </div>
  );
}
