"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import CreateGiveawayForm from "./components/CreateGiveawayForm";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { cn } from "@repo/ui/utils";
import { mono } from "@repo/ui/utils";
import { useIsMounted } from "usehooks-ts";

export default function CreateGiveaway() {
  const mounted = useIsMounted();
  const wallet = useWallet();

  if (!wallet.publicKey) {
    return (
      <div className="flex flex-col gap-[50px] grow items-center justify-start py-[50px]">
        <div className="flex flex-col gap-2 items-center">
          <h1 className="text-4xl">Create a DROP</h1>
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
    <div className="flex flex-col items-center justify-start grow py-20">
      <div className="max-w-[737px] lg:w-[737px]  flex flex-col items-start justify-start gap-[40px] grow">
        <CreateGiveawayForm wallet={wallet} mounted={mounted} />
      </div>
    </div>
  );
}
