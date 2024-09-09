import BN from "bn.js";
import { Program, utils } from "@coral-xyz/anchor";
import { DropperGiveaway } from "../types";
import { PublicKey } from "@solana/web3.js";

export function getSolGiveawayPda(
  program: Program<DropperGiveaway>,
  giveawayId: number,
  creatorKey: PublicKey
) {
  const [giveawayPDA] = PublicKey.findProgramAddressSync(
    [
      utils.bytes.utf8.encode("sol_giveaway"),
      new BN(giveawayId).toArrayLike(Buffer, "le", 8),
      creatorKey.toBuffer(),
    ],
    program.programId
  );

  return giveawayPDA;
}
