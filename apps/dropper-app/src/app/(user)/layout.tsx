import type { Metadata } from "next";
import "../globals.css";
import { dropper } from "@/lib/utils/fonts";
import { cn } from "@/lib/utils/classNames";
import { createSupabaseServer } from "@/lib/supabase/server";
import { DropmanView } from "@repo/types/user";
import Login from "./login/page";
import { AccessCodeRow, UserCodeRow } from "@repo/types/codes";
import Code from "./code/page";
import { GiveawayTicker } from "@repo/types/giveaway";
import Header from "@/components/Header";

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
  const tickers = await getTickers();
  const supabase = createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: DropmanView | null = null;
  let accessCode: UserCodeRow | null = null;
  if (user) {
    const { data } = await supabase
      .from("dropmans_view")
      .select("*")
      .eq("user_id", user.id)
      .single();
    profile = data;

    const { data: code } = await supabase
      .from("user_codes")
      .select("*")
      .eq("user_id", user.id)
      .single();
    accessCode = code;
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
  tickers: GiveawayTicker[];
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

async function getTickers() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/giveaways/tickers`,
      {
        next: {
          revalidate: 60,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to fetch tickers");
    }

    return response.json() as Promise<GiveawayTicker[]>;
  } catch (error) {
    console.error(error);
    return [];
  }
}
