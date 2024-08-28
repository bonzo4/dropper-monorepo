import { AnchorProvider } from "@coral-xyz/anchor";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";

export function getProvider(
  wallet: WalletContextState | NodeWallet,
  connection: Connection
) {
  const { publicKey, signTransaction, signAllTransactions } = wallet;
  if (!publicKey || !signTransaction || !signAllTransactions)
    throw new Error("Wallet not connected");
  return new AnchorProvider(connection, {
    publicKey,
    signTransaction,
    signAllTransactions,
  });
}
