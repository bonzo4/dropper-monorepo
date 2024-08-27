import { Connection, PublicKey } from "@solana/web3.js";
import { getDropperGiveaway } from "../program";
import { BN } from "bn.js";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { Program } from "@coral-xyz/anchor";
import { DropperGiveaway } from "../types";

type RepoSolGiveawayInstructionOptions = {
  destinationKey: PublicKey;
  program: Program<DropperGiveaway>;
  giveawayId: number;
};

export async function repoSolGiveawayInstruction({
  destinationKey,
  program,
  giveawayId,
}: RepoSolGiveawayInstructionOptions) {
  if (!program.provider.publicKey) throw new Error("Wallet not connected");

  const instruction = await program.methods
    .repoSolGiveaway(new BN(giveawayId))
    .accounts({
      signer: program.provider.publicKey,
      destinationAccount: destinationKey,
    })
    .instruction();

  return instruction;
}
