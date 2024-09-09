import { PublicKey } from "@solana/web3.js";
import { BN, Program } from "@coral-xyz/anchor";
import { getMint, Mint } from "@solana/spl-token";
import { DropperGiveaway } from "../types";

type CreateSplGiveawayInstructionOptions = {
  giveawayId: number;
  rewardAmount: number;
  winnersAmount: number;
  tokenAddress: string;
  program: Program<DropperGiveaway>;
};

export async function createSplGiveawayInstruction({
  program,
  giveawayId,
  rewardAmount,
  winnersAmount,
  tokenAddress,
}: CreateSplGiveawayInstructionOptions) {
  if (!program.provider.publicKey) throw new Error("Wallet not connected");
  let mint: Mint;
  try {
    mint = await getMint(
      program.provider.connection,
      new PublicKey(tokenAddress)
    );
  } catch (_) {
    throw new Error("Mint Address not found");
  }

  const tx = await program.methods
    .createSplGiveaway({
      giveawayId: new BN(giveawayId),
      rewardAmount: new BN(
        (rewardAmount * Math.pow(10, mint.decimals)) / winnersAmount
      ),
      winnersAmount: new BN(winnersAmount),
    })
    .accounts({
      signer: program.provider.publicKey,
      tokenMint: tokenAddress,
    })
    .instruction();

  return tx;
}
