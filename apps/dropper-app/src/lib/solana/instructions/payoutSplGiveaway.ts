import { Connection, PublicKey } from "@solana/web3.js";
import { getDropperGiveaway } from "../program";
import BN from "bn.js";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { DropperGiveaway } from "../types";
import { Program } from "@coral-xyz/anchor";

type PayoutSplGiveawayInstructionOptions = {
  winnerKey: PublicKey;
  tokenKey: PublicKey;
  program: Program<DropperGiveaway>;
  giveawayId: number;
};

export async function payoutSplGiveawayInstruction({
  winnerKey,
  tokenKey,
  program,
  giveawayId,
}: PayoutSplGiveawayInstructionOptions) {
  if (!program.provider.publicKey) throw new Error("Wallet not connected");

  const instruction = await program.methods
    .payoutSplGiveaway(new BN(giveawayId))
    .accounts({
      signer: program.provider.publicKey,
      winnerAccount: winnerKey,
      tokenMint: tokenKey,
    })
    .instruction();

  return instruction;
}
