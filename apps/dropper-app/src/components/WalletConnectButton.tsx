import { WalletName } from "@solana/wallet-adapter-base";
import Button from "./ui/Button";
import {
  PhantomWalletName,
  SolflareWalletName,
} from "@solana/wallet-adapter-wallets";

type WalletConnectButtonProps = {
  connect: () => void;
  select: (walletName: WalletName) => void;
} & React.ComponentProps<typeof Button>;

export default function WalletConnectButton({
  connect,
  select,
  ...props
}: WalletConnectButtonProps) {
  return (
    <Button
      type="button"
      {...props}
      onClick={() => {
        select(SolflareWalletName);
        connect();
      }}
    >
      Connect Wallet
    </Button>
  );
}
