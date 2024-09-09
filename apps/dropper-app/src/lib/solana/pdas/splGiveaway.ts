import { BN, Program, utils } from "@coral-xyz/anchor";
import { DropperGiveaway } from "../types";
import { PublicKey } from "@solana/web3.js";

export function getSplGiveawayPda(
  program: Program<DropperGiveaway>,
  giveawayId: number,
  creatorKey: PublicKey
) {
  const [giveawayPDA] = PublicKey.findProgramAddressSync(
    [
      utils.bytes.utf8.encode("spl_giveaway"),
      new BN(giveawayId).toArrayLike(Buffer, "le", 8),
      creatorKey.toBuffer(),
    ],
    program.programId
  );

  return giveawayPDA;
}
