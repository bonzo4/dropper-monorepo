import BN from "bn.js";
import { Program } from "@coral-xyz/anchor";
import { DropperGiveaway } from "../types";
import { PublicKey } from "@solana/web3.js";

type ClaimSolGiveawayInstructionOptions = {
  program: Program<DropperGiveaway>;
  giveawayId: number;
  creatorKey: PublicKey;
};

export async function claimSolGiveawayInstruction({
  program,
  giveawayId,
  creatorKey,
}: ClaimSolGiveawayInstructionOptions) {
  if (!program.provider.publicKey) throw new Error("Wallet not connected");

  const instruction = await program.methods
    .claimSolGiveaway(new BN(giveawayId), creatorKey)
    .accounts({
      signer: program.provider.publicKey,
    })
    .instruction();

  return instruction;
}
