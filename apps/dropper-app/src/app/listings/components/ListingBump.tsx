import { Mark, SolanaMulti } from "@repo/ui/icons";
import { Button } from "@repo/ui";
import { cn } from "@repo/ui/utils";
import { mono } from "@repo/ui/utils";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useIsMounted } from "usehooks-ts";

type Props = {
  listingId: number;
  hideBump: () => void;
  bump: (id: number) => void;
  wallet: WalletContextState;
  bumpDisabled: boolean;
};

export function ListingBump({
  listingId,
  hideBump,
  bump,
  wallet,
  bumpDisabled,
}: Props) {
  return (
    <div className="relative flex flex-col items-center gap-4 px-2 sm:px-10 py-6 border-2 border-primary bg-secondary rounded-md">
      <Mark
        onClick={hideBump}
        className="absolute top-2 right-2 hover:cursor-pointer"
      />
      <span className="text-[30px]">REFRESH LISTING</span>
      <span
        className={cn(
          mono.className,
          "text-xs opacity-50 w-[325px] text-center"
        )}
      >
        The ranking can be updated at any time, and your favorite drop will
        appear first on the homepage every time it is refreshed
      </span>
      <div className="flex flex-row items-center justify-between border-2 border-primary w-[300px] px-4 py-1 rounded-md text-lg">
        <span className={cn(mono.className)}>0.001</span>
        <div className="flex flex-row gap-1 items-center">
          <span className={cn(mono.className)}>$SOL</span>
          <div className="">
            <SolanaMulti height={18} />
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center gap-2">
        <WalletMultiButton />
        {wallet.publicKey && (
          <Button
            className="px-4"
            onClick={() => bump(listingId)}
            disabled={bumpDisabled}
          >
            Pay
          </Button>
        )}
      </div>
    </div>
  );
}
