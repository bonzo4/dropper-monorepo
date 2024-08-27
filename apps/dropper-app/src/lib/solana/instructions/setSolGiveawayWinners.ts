import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { Program } from "@coral-xyz/anchor";
import { DropperGiveaway } from "../types";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";

type SetSolGiveawayWinnersInstructionOptions = {
  winnerKeys: PublicKey[];
  giveawayId: number;
  program: Program<DropperGiveaway>;
  wallet: NodeWallet;
};

export async function setSolGiveawayWinnersInstruction({
  winnerKeys,
  giveawayId,
  program,
  wallet,
}: SetSolGiveawayWinnersInstructionOptions) {
  if (!program.provider.publicKey) throw new Error("Wallet not connected");

  const instruction = await program.methods
    .setSolGiveawayWinners({ winnerKeys, giveawayId: new BN(giveawayId) })
    .accounts({
      signer: program.provider.publicKey,
    })
    .signers([wallet.payer])
    .instruction();

  return instruction;
}
