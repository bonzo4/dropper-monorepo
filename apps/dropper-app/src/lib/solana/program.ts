import { Program, AnchorProvider, Wallet } from "@coral-xyz/anchor";
import { Connection } from "@solana/web3.js";

import { WalletContextState } from "@solana/wallet-adapter-react";
import { IDL } from "./idl";
import { DropperGiveaway } from "./types";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";

export function getDropperGiveaway(
  wallet: WalletContextState | NodeWallet,
  connection: Connection
) {
  const { publicKey, signTransaction, signAllTransactions } = wallet;
  if (!publicKey || !signTransaction || !signAllTransactions) return;

  const provider = new AnchorProvider(connection, {
    publicKey,
    signTransaction,
    signAllTransactions,
  });

  const program = new Program(
    IDL,
    provider
  ) as unknown as Program<DropperGiveaway>;

  return program;
}
