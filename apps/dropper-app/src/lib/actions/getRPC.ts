"use server";

export async function getRPC() {
  return process.env.SOLANA_RPC_URL!;
}

export async function getWSS() {
  return process.env.SOLANA_WSS_URL!;
}
