"use client";
import ManageGiveaways from "./components/ManageGiveaways";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWhitelistWallet } from "@/lib/hooks/useWhitelistWallet";
import { mono } from "@/lib/utils/fonts";
import { cn } from "@/lib/utils/classNames";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useIsMounted } from "usehooks-ts";
import { createSupabaseClient } from "@/lib/supabase/client";

export default function ManageGiveawaysPage() {
  const supabase = createSupabaseClient();
  const mounted = useIsMounted();
  const wallet = useWallet();

  const { isWhitelisted, loading } = useWhitelistWallet({
    publicKey: wallet.publicKey ? wallet.publicKey.toBase58() : null,
  });

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

  if (loading) {
    return (
      <div className="flex flex-col gap-[50px] grow items-center justify-start py-[50px]">
        <div className="flex flex-col gap-2 items-center">
          <h1 className="text-4xl">Manage Drops</h1>
          <div className="flex flex-row gap-2">
            <span className={cn(mono.className, "text-[16px]")}>
              Connected Wallet:
            </span>
            <span className={cn(mono.className, "text-[16px], text-primary")}>
              {wallet.publicKey.toBase58().slice(0, 4)}...
              {wallet.publicKey.toBase58().slice(-4)}
            </span>
          </div>
        </div>
        <span>Loading...</span>
      </div>
    );
  }

  if (!isWhitelisted) {
    return (
      <div className="flex flex-col gap-[50px] grow items-center justify-start py-[50px]">
        <div className="flex flex-col gap-2 items-center">
          <h1 className="text-4xl">Manage DROPS</h1>
          <div className="flex flex-row gap-2">
            <span className={cn(mono.className, "text-[16px]")}>
              Connected Wallet:
            </span>
            <span className={cn(mono.className, "text-[16px], text-primary")}>
              {wallet.publicKey.toBase58().slice(0, 4)}...
              {wallet.publicKey.toBase58().slice(-4)}
            </span>
          </div>
        </div>
        <span>
          Please contact one of out team members about being able to create
          Drops on Dropper
        </span>
      </div>
    );
  }

  return (
    <div className="flex grow h-full">
      <ManageGiveaways publicKey={wallet.publicKey} supabase={supabase} />
    </div>
  );
}
