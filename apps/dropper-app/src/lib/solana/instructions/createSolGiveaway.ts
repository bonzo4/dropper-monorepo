import { BN, Program } from "@coral-xyz/anchor";
import { DropperGiveaway } from "../types";

type CreateSplGiveawayInstructionOptions = {
  program: Program<DropperGiveaway>;
  giveawayId: number;
  solanaAmount: number;
  winnersAmount: number;
};

export async function createSolGiveawayInstruction({
  program,
  giveawayId,
  solanaAmount,
  winnersAmount,
}: CreateSplGiveawayInstructionOptions) {
  if (!program.provider.publicKey) throw new Error("Wallet not connected");

  const tx = await program.methods
    .createSolGiveaway({
      giveawayId: new BN(giveawayId),
      lamportsAmount: new BN((solanaAmount * Math.pow(10, 9)) / winnersAmount),
      winnersAmount: new BN(winnersAmount),
    })
    .accounts({
      signer: program.provider.publicKey,
    })
    .instruction();

  return tx;
}
