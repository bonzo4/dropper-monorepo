import { createNewSolanaConnection } from "@/lib/solana/connection";
import { setSolGiveawayWinnersInstruction } from "@/lib/solana/instructions/setSolGiveawayWinners";
import { setSplGiveawayWinnersInstruction } from "@/lib/solana/instructions/setSplGiveawayWinners";
import { getDropperGiveaway } from "@/lib/solana/program";
import { sendTransaction } from "@/lib/solana/sendTransaction";
import { getManagerWallet } from "@/lib/solana/wallet";
import { createSupabaseServer } from "@/lib/supabase/server";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params: { id } }: { params: { id: number } }
) {
  try {
    if (
      request.headers.get("user-agent") !==
      "PostgreSQL 15.1 (Ubuntu 15.1-1.pgdg20.04+1) on aarch64-unknown-linux-gnu, compiled by gcc (Ubuntu 9.4.0-1ubuntu1~20.04.1) 9.4.0, 64-bit"
    )
      throw new Error("Unauthorized");
    const bodyData = await request.json();
    if (!bodyData.winners) throw new Error("No winners provided");
    const winners = bodyData.winners as string[];
    const winnerKeys = winners.map((key) => new PublicKey(key));

    const supabase = await createSupabaseServer();

    const { data, error } = await supabase
      .from("giveaways")
      .select("token_address, winner_amount")
      .eq("id", id)
      .single();

    if (error) throw new Error("Couldn't find giveaway");

    const managerWallet = await getManagerWallet();

    let instruction: TransactionInstruction;

    const connection = createNewSolanaConnection({
      type: "devnet",
    });

    const program = getDropperGiveaway(managerWallet, connection);
    if (!program) throw new Error("Program not found");

    if (data.token_address) {
      instruction = await setSplGiveawayWinnersInstruction({
        winnerKeys,
        program,
        giveawayId: id,
        wallet: managerWallet,
      });
    } else {
      instruction = await setSolGiveawayWinnersInstruction({
        winnerKeys,
        giveawayId: id,
        program,
        wallet: managerWallet,
      });
    }

    const txString = await sendTransaction({
      provider: program.provider,
      transactionInstructions: [instruction],
      wallet: managerWallet,
    });

    return NextResponse.json(JSON.stringify(txString), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(JSON.stringify(err.message), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
