import Tab from "@/components/ui/Tab";
import { headers } from "next/headers";
import { createSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Profile from "./components/Profile";
import ProfileStats from "./components/ProfileStats";
import { ProfilePageData } from "@/app/api/profile/route";

export default async function ProfilePage() {
  const profile = await getProfilePageData();
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

async function getProfilePageData() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/profile`, {
    headers: new Headers(headers()),
  });

  if (response.status !== 200) redirect("/");

  const data = await response.json();

  return data as ProfilePageData;
}
