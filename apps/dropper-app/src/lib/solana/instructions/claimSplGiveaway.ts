import { WalletContextState } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import { getDropperGiveaway } from "../program";
import BN from "bn.js";
import { Program } from "@coral-xyz/anchor";
import { DropperGiveaway } from "../types";

type ClaimSplGiveawayInstructionOptions = {
  program: Program<DropperGiveaway>;
  giveawayId: number;
  mint: PublicKey;
};

export async function claimSplGiveawayInstruction({
  program,
  giveawayId,
  mint,
}: ClaimSplGiveawayInstructionOptions) {
  if (!program.provider.publicKey) throw new Error("Wallet not connected");

  if (!program) throw new Error("Program not found");

  const instruction = await program.methods
    .claimSplGiveaway(new BN(giveawayId))
    .accounts({
      signer: program.provider.publicKey,
      tokenMint: mint,
    })
    .instruction();

  return instruction;
}
