import { NextRequest } from "next/server";
import { Keypair } from "@solana/web3.js";

export function GET(request: NextRequest) {
  const manager = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(process.env.MANAGER_KEYPAIR!))
  );

  return new Response(JSON.stringify(manager), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_URL!,
    },
  });
}
