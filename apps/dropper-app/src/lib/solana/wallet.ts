import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { Keypair, Signer } from "@solana/web3.js";

export async function getManagerWallet() {
  return new NodeWallet(
    Keypair.fromSecretKey(
      Uint8Array.from(JSON.parse(process.env.MANAGER_KEYPAIR!))
    )
  );
}
