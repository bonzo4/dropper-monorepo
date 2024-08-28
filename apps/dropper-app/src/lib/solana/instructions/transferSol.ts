import { createTransferInstruction } from "@solana/spl-token";
import { PublicKey, SystemProgram } from "@solana/web3.js";

type Options = {
  source: PublicKey;
  solAmount: number;
};

export async function transferSolInstruction({ source, solAmount }: Options) {
  const destination = new PublicKey(process.env.NEXT_PUBLIC_VAULT_KEY!);
  const instruction = SystemProgram.transfer({
    fromPubkey: source,
    toPubkey: destination,
    lamports: solAmount * 10 ** 9,
  });
  //   const instruction = createTransferInstruction(
  //     source,
  //     destination,
  //     source,
  //     solAmount * 10 ** 9,
  //     [],
  //     new PublicKey("So11111111111111111111111111111111111111112")
  //   );

  return instruction;
}
