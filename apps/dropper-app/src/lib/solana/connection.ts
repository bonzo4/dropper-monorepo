import { Connection, clusterApiUrl } from "@solana/web3.js";

export function createNewSolanaConnection() {
  return new Connection(process.env.SOLANA_RPC_URL!, "confirmed");
}
