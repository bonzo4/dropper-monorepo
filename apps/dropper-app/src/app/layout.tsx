import type { Metadata } from "next";
import "./globals.css";
import { dropper } from "@repo/ui/utils";
import { cn } from "@repo/ui/utils";
import Header from "@/components/header/Header";
import { createSupabaseServer } from "@repo/lib/supabase";
import { DropmanView } from "@/lib/types/user";
import Login from "./login/page";
import { UserCodeRow } from "@/lib/types/accessCode";
import Code from "./code/page";
import { getTickers, TickerGiveaway } from "@/lib/data/getTickers";
import { cache } from "react";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Dropper",
  description:
    "Get the latest info on the hottest airdrops on all Blockchains.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createSupabaseServer();
  const userData = cache(() => supabase.auth.getUser())();
  const tickersData = getTickers({ supabase });

  const [
    {
      data: { user },
    },
    tickers,
  ] = await Promise.all([userData, tickersData]);

  let profile: DropmanView | null = null;
  let accessCode: UserCodeRow | null = null;

  if (user) {
    const profilePromise = supabase
      .from("dropmans_view")
      .select("*")
      .eq("user_id", user.id)
      .single();

    const codePromise = supabase
      .from("user_codes")
      .select("*")
      .eq("user_id", user.id)
      .single();

    const [{ data: profileData }, { data: accessCodeData }] = await Promise.all(
      [await profilePromise, await codePromise]
    );

    profile = profileData;
    accessCode = accessCodeData;
  }

  if (!profile) {
    return (
      <LayoutWrapper profile={profile} tickers={tickers}>
        <Login />
      </LayoutWrapper>
    );
  }

  if (!accessCode) {
    return (
      <LayoutWrapper profile={profile} tickers={tickers}>
        <Code />
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper profile={profile} tickers={tickers}>
      {children}
    </LayoutWrapper>
  );
}

function LayoutWrapper({
  profile,
  children,
  tickers,
}: {
  profile: DropmanView | null;
  children: React.ReactNode;
  tickers: TickerGiveaway[];
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "relative flex flex-col min-h-screen w-full",
          dropper.className
        )}
      >
        <Header tickers={tickers} profile={profile} />
        {children}
      </body>
    </html>
  );
}
