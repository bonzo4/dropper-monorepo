"use client";
import ManageGiveaways from "./components/ManageGiveaways";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWhitelistWallet } from "@/lib/hooks/useWhitelistWallet";
import { mono } from "@repo/ui/utils";
import { cn } from "@repo/ui/utils";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useIsMounted } from "usehooks-ts";
import { createSupabaseClient } from "@repo/lib/supabase";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Drops | Dropper",
  description: "dropper.wtf - Discover Token and Meme-Coin drops.",
  keywords: [
    "crypto",
    "cryptocurrency",
    "blockchain",
    "token",
    "meme-coin",
    "drop",
    "giveaway",
    "airdrop",
    "solana",
    "ethereum",
    "bitcoin",
    "manage",
  ],
  openGraph: {
    url: "https://dropper.wtf/drops/manage",
    type: "website",
    title: "Manage Drops | Dropper",
    description: "dropper.wtf - Discover Token and Meme-Coin drops.",
    images: [
      {
        url: "https://pmlweoiqgtcwuxpclgql.supabase.co/storage/v1/object/public/website/thumbnail.png",
        width: 1440,
        height: 1274,
        alt: "Dropper",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Manage Drops | Dropper",
    description: "dropper.wtf - Discover Token and Meme-Coin drops.",
    creator: "@DropperNTWRK",
    site: "@DropperNTWRK",
    images: [
      {
        url: "https://pmlweoiqgtcwuxpclgql.supabase.co/storage/v1/object/public/website/thumbnail.png",
        width: 1440,
        height: 1274,
        alt: "Dropper",
      },
    ],
  },
  alternates: {
    canonical: "https://dropper.wtf/drops/manage",
  },
};

export default function ManageGiveawaysPage() {
  const supabase = createSupabaseClient();
  const mounted = useIsMounted();
  const wallet = useWallet();

  if (!wallet.publicKey) {
    return (
      <div className="flex flex-col gap-[50px] grow items-center justify-start py-[50px]">
        <div className="flex flex-col gap-2 items-center">
          <h1 className="text-4xl">Manage DROPS</h1>
          <div className="flex flex-row gap-2">
            <span className={cn(mono.className, "text-[16px]")}>
              Connected Wallet:
            </span>
            <span className={cn(mono.className, "text-[16px], text-primary")}>
              None
            </span>
          </div>
        </div>
        {mounted() && <WalletMultiButton />}
      </div>
    );
  }

  return (
    <div className="flex grow h-full">
      <ManageGiveaways publicKey={wallet.publicKey} supabase={supabase} />
    </div>
  );
}
