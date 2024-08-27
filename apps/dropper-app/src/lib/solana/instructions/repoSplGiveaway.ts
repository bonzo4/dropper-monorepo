import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { Connection, PublicKey } from "@solana/web3.js";
import { getDropperGiveaway } from "../program";
import BN from "bn.js";
import { Program } from "@coral-xyz/anchor";
import { DropperGiveaway } from "../types";

type RepoSplGiveawayInstructionOptions = {
  destinationKey: PublicKey;
  tokenKey: PublicKey;
  program: Program<DropperGiveaway>;
  giveawayId: number;
};

export async function repoSplGiveawayInstruction({
  destinationKey,
  tokenKey,
  program,
  giveawayId,
}: RepoSplGiveawayInstructionOptions) {
  if (!program.provider.publicKey) throw new Error("Wallet not connected");

  const instruction = await program.methods
    .repoSplGiveaway(new BN(giveawayId))
    .accounts({
      signer: program.provider.publicKey,
      destinationAccount: destinationKey,
      tokenMint: tokenKey,
    })
    .instruction();

  return instruction;
}
