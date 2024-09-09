import { Connection, PublicKey } from "@solana/web3.js";
import { getDropperGiveaway } from "../program";
import { BN } from "bn.js";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { Program } from "@coral-xyz/anchor";
import { DropperGiveaway } from "../types";

type PayoutSolGiveawayInstructionOptions = {
  winnerKey: PublicKey;
  program: Program<DropperGiveaway>;
  giveawayId: number;
  creatorKey: PublicKey;
};

export async function payoutSolGiveawayInstruction({
  program,
  giveawayId,
  winnerKey,
  creatorKey,
}: PayoutSolGiveawayInstructionOptions) {
  if (!program.provider.publicKey) throw new Error("Wallet not connected");

  const instruction = await program.methods
    .payoutSolGiveaway(new BN(giveawayId), creatorKey)
    .accounts({
      signer: program.provider.publicKey,
      winnerAccount: winnerKey,
    })
    .instruction();

  return instruction;
}
