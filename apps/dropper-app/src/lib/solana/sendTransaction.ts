import {
  sendAndConfirmTransaction,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { computeBudgetInstruction } from "./instructions/computeBudget";
import { Program } from "@coral-xyz/anchor";
import { DropperGiveaway } from "./types";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { AnchorWallet } from "@solana/wallet-adapter-react";

type SendTransactionOptions = {
  program: Program<DropperGiveaway>;
  transactionInstructions: TransactionInstruction[];
  wallet?: NodeWallet;
};

export async function sendTransaction({
  program,
  wallet,
  transactionInstructions,
}: SendTransactionOptions) {
  if (!program.provider.publicKey) throw new Error("Wallet not connected");
  if (!program.provider.sendAndConfirm) throw new Error("Wallet not connected");
  const { addPriorityFee } = await computeBudgetInstruction({
    program: program,
    transactionInstructions,
  });

  const transaction = new Transaction().add(
    addPriorityFee,
    ...transactionInstructions
  );

  const latestBlockHash = await program.provider.connection.getLatestBlockhash({
    commitment: "finalized",
  });
  transaction.recentBlockhash = latestBlockHash.blockhash;
  transaction.feePayer = program.provider.publicKey;

  let txString: string;

  if (wallet) {
    txString = await sendAndConfirmTransaction(
      program.provider.connection,
      transaction,
      [wallet.payer]
    );
  } else {
    txString = await program.provider.sendAndConfirm(transaction);
  }

  return txString;
}
