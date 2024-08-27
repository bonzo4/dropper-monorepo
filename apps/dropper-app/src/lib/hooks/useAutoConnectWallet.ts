import { WalletName } from "@solana/wallet-adapter-base";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  BitgetWalletName,
  MathWalletName,
  PhantomWalletName,
  SolflareWalletName,
  TokenPocketWalletName,
} from "@solana/wallet-adapter-wallets";
import { useCallback } from "react";

const useAutoConnectPhantom = () => {
  const { select, connect, connected } = useWallet();
  const connectPhantom = useCallback(async () => {
    // Retrieve the wallet name from local storage
    let walletName = window.localStorage.getItem("walletName");
    // Default to Phantom if no wallet name is found or if it's undefined
    walletName =
      !walletName || walletName === "undefined" ? "Phantom" : walletName;
    // Map of wallet names to wallet adapter constants
    const wallet: Record<string, WalletName> = {
      TokenPocket: TokenPocketWalletName,
      Phantom: PhantomWalletName,
      Bitget: BitgetWalletName,
      Solflare: SolflareWalletName,
      MathWallet: MathWalletName,
    };
    // Select the wallet and connect if not already connected
    if (!connected) {
      select(wallet[walletName]);
    }
  }, [select, connected]);
  return connectPhantom;
};
export default useAutoConnectPhantom;
