import { ComputeBudgetProgram, TransactionInstruction } from "@solana/web3.js";
import { AnchorProvider, Provider } from "@coral-xyz/anchor";

type ComputeBudgetInstructionOptions = {
  provider: AnchorProvider | Provider;
  transactionInstructions: TransactionInstruction[];
};

export const computeBudgetInstruction = async ({
  provider,
  transactionInstructions,
}: ComputeBudgetInstructionOptions) => {
  const priorityFees = await provider.connection.getRecentPrioritizationFees({
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
