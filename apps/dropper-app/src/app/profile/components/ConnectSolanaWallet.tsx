"use client";
import { createSolanaWallet } from "@/lib/actions/profile/createSolanaWallet";
import { deleteSolanaWallet } from "@/lib/actions/profile/deleteSolanaWallet";
import { SolanaWallet } from "@/lib/types/profile";
import { Button } from "@repo/ui";
import { cn, mono } from "@repo/ui/utils";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {
  userId: string;
  solanaWallet: SolanaWallet | null;
};

export default function ConnectSolanaWallet({ userId, solanaWallet }: Props) {
  const router = useRouter();
  const wallet = useWallet();

  useEffect(() => {
    const saveWallet = async () => {
      if (!wallet.connected || !wallet.publicKey) return;
      await createSolanaWallet({
        userId,
        address: wallet.publicKey.toBase58(),
      });
      router.refresh();
    };

    saveWallet();
  }, [router, userId, wallet.connected, wallet.publicKey]);

  const handleDelete = async () => {
    if (!solanaWallet) return;
    deleteSolanaWallet({ userId: solanaWallet.user_id });
    router.refresh();
  };

  return (
    <div className="flex flex-col w-full gap-4">
      <h2 className="text-3xl">Connect Solana Wallet</h2>
      {!solanaWallet && <WalletMultiButton />}
      {solanaWallet && (
        <div className="flex flex-row gap-2 items-center">
          <div>
            <Button onClick={handleDelete}>Disconnect</Button>
          </div>
          <p className={cn(mono.className, "text-lg")}>
            Connected Wallet: {solanaWallet.address.slice(0, 6)}...
            {solanaWallet.address.slice(-6)}
          </p>
        </div>
      )}
    </div>
  );
}
