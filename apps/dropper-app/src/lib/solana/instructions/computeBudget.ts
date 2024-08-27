import {
  ComputeBudgetProgram,
  Connection,
  TransactionInstruction,
} from "@solana/web3.js";
import { DropperGiveaway } from "../types";
import { Program } from "@coral-xyz/anchor";

type ComputeBudgetInstructionOptions = {
  program: Program<DropperGiveaway>;
  transactionInstructions: TransactionInstruction[];
};

export const computeBudgetInstruction = async ({
  program,
  transactionInstructions,
}: ComputeBudgetInstructionOptions) => {
  const priorityFees =
    await program.provider.connection.getRecentPrioritizationFees({
      lockedWritableAccounts: transactionInstructions
        .map((ti) => ti.keys.filter((a) => a.isWritable).map((a) => a.pubkey))
        .flat(),
    });
  // get average priority fee
  const avgPriorityFee =
    priorityFees.reduce((acc, fee) => acc + fee.prioritizationFee, 0) /
    priorityFees.length;
  //   const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
  //     units: 1000000,
  //   });

  const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
    microLamports: parseInt(avgPriorityFee.toFixed(0)),
  });

  return {
    // modifyComputeUnits,
    addPriorityFee,
  };
};
