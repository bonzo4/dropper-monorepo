import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { Program } from "@coral-xyz/anchor";
import { DropperGiveaway } from "../types";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";

type SetSplGiveawayWinnersInstructionOptions = {
  winnerKeys: PublicKey[];
  giveawayId: number;
  program: Program<DropperGiveaway>;
  wallet: NodeWallet;
};

export async function setSplGiveawayWinnersInstruction({
  winnerKeys,
  giveawayId,
  program,
  wallet,
}: SetSplGiveawayWinnersInstructionOptions) {
  if (!program.provider.publicKey) throw new Error("Wallet not connected");

  const instruction = await program.methods
    .setSplGiveawayWinners({ winnerKeys, giveawayId: new BN(giveawayId) })
    .accounts({
      signer: program.provider.publicKey,
    })
    .signers([wallet.payer])
    .instruction();

  return instruction;
}
