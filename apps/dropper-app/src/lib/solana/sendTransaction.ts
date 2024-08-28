import {
  Connection,
  sendAndConfirmTransaction,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { computeBudgetInstruction } from "./instructions/computeBudget";
import { AnchorProvider, Program, Provider } from "@coral-xyz/anchor";
import { DropperGiveaway } from "./types";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { AnchorWallet } from "@solana/wallet-adapter-react";

type SendTransactionOptions = {
  provider: AnchorProvider | Provider;
  transactionInstructions: TransactionInstruction[];
  wallet?: NodeWallet;
};

export async function sendTransaction({
  provider,
  wallet,
  transactionInstructions,
}: SendTransactionOptions) {
  if (!provider.publicKey) throw new Error("Wallet not connected");
  if (!provider.sendAndConfirm) throw new Error("Wallet not connected");
  const { addPriorityFee } = await computeBudgetInstruction({
    provider,
    transactionInstructions,
  });

  const transaction = new Transaction().add(
    addPriorityFee,
    ...transactionInstructions
  );

  const latestBlockHash = await provider.connection.getLatestBlockhash({
    commitment: "finalized",
  });
  transaction.recentBlockhash = latestBlockHash.blockhash;
  transaction.feePayer = provider.publicKey;

  let txString: string;

  if (wallet) {
    txString = await sendAndConfirmTransaction(
      provider.connection,
      transaction,
      [wallet.payer]
    );
  } else {
    txString = await provider.sendAndConfirm(transaction);
  }

  return txString;
}
