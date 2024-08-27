"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { cn } from "@/lib/utils/classNames";
import { mono } from "@/lib/utils/fonts";
import { useWhitelistWallet } from "@/lib/hooks/useWhitelistWallet";
import { useIsMounted } from "usehooks-ts";
import CreateCtoForm from "./components/CreateCtoForm";

export default function CreateCTO() {
  const mounted = useIsMounted();
  const wallet = useWallet();

  const { isWhitelisted, loading } = useWhitelistWallet({
    publicKey: wallet.publicKey ? wallet.publicKey.toBase58() : null,
  });

  if (!wallet.publicKey) {
    return (
      <div className="flex flex-col gap-[50px] grow items-center justify-start py-[50px]">
        <div className="flex flex-col gap-2 items-center">
          <h1 className="text-4xl">Create a CTO</h1>
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
          <h1 className="text-4xl">Create a CTO</h1>
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
          <h1 className="text-4xl">Create a CTO</h1>
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
    <div className="flex flex-col items-center justify-start grow py-20">
      <div className="max-w-[737px] lg:w-[737px]  flex flex-col items-start justify-start gap-[40px] grow">
        <CreateCtoForm wallet={wallet} mounted={mounted} />
      </div>
    </div>
  );
}
