import { Connection, clusterApiUrl } from "@solana/web3.js";

type CreateNewSolanaConnectionOptions = {
  type: "mainnet-beta" | "devnet";
};

export function createNewSolanaConnection({
  type,
}: CreateNewSolanaConnectionOptions) {
  return new Connection(process.env.SOLANA_RPC_URL!, "confirmed");
}
