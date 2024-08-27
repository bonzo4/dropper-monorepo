import type { Metadata } from "next";
import "../globals.css";
import { dropper } from "@/lib/utils/fonts";
import { cn } from "@/lib/utils/classNames";
import Header from "@/components/header/Header";
import { createSupabaseServer } from "@/lib/supabase/server";
import { DropmanView } from "@/lib/types/user";
import { TickerGiveaway } from "../api/giveaways/tickers/route";
import Login from "./login/page";
import { AccessCodeRow, UserCodeRow } from "@/lib/types/accessCode";
import Code from "./code/page";

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

    return response.json() as Promise<TickerGiveaway[]>;
  } catch (error) {
    console.error(error);
    return [];
  }
}
