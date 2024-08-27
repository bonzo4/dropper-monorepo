import { createTransferInstruction } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";

type Options = {
  source: PublicKey;
  solAmount: number;
};

export async function transferSolInstruction({ source, solAmount }: Options) {
  const destination = new PublicKey(process.env.NEXT_PUBLIC_VAULT_KEY!);
  const instruction = createTransferInstruction(
    source,
    destination,
    source,
    solAmount * 10 ** 9
  );

  return instruction;
}
