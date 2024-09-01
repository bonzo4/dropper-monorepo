import type { Metadata } from "next";
import "../globals.css";
import { dropper } from "@/lib/utils/fonts";
import { cn } from "@/lib/utils/classNames";
import { createSupabaseServer } from "@/lib/supabase/server";
import { DropmanView } from "@repo/types/user";
import { GiveawayTicker } from "@repo/types/giveaway";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Dropper Creator",
  description:
    "Get the latest info on the hottest airdrops on all Blockchains.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: DropmanView | null = null;
  if (user) {
    const { data } = await supabase
      .from("dropmans_view")
      .select("*")
      .eq("user_id", user.id)
      .single();
    profile = data;
  }

  const tickers = await getTickers();

  return (
    <html lang="en">
      <body
        className={cn(
          "relative flex flex-col min-h-screen w-full",
          dropper.className
        )}
      >
        <Header profile={profile} tickers={tickers} />
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
