import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@repo/ui";

type WalletDisconnectButtonProps = {
  disconnect: () => void;
  publicKey: string;
} & React.ComponentProps<typeof Button>;

export default function WalletDisconnectButton({
  disconnect,
  publicKey,
  ...props
}: WalletDisconnectButtonProps) {
  return (
    <div className="flex flex-col gap-1">
      <Button type="button" {...props} onClick={() => disconnect()}>
        Disconnect Wallet
      </Button>
      <span className="text-xs text-gray-400">
        Current wallet:{publicKey.slice(0, 4)}...{publicKey.slice(-4)}
      </span>
    </div>
  );
}
