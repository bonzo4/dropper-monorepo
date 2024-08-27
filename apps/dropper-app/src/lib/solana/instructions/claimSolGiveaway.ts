import BN from "bn.js";
import { Program } from "@coral-xyz/anchor";
import { DropperGiveaway } from "../types";

type ClaimSolGiveawayInstructionOptions = {
  program: Program<DropperGiveaway>;
  giveawayId: number;
};

export async function claimSolGiveawayInstruction({
  program,
  giveawayId,
}: ClaimSolGiveawayInstructionOptions) {
  if (!program.provider.publicKey) throw new Error("Wallet not connected");

  const instruction = await program.methods
    .claimSolGiveaway(new BN(giveawayId))
    .accounts({
      signer: program.provider.publicKey,
    })
    .instruction();

  return instruction;
}
