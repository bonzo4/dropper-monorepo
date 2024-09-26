import { createNewSolanaConnection } from "@/lib/solana/connection";
import { setSolGiveawayWinnersInstruction } from "@/lib/solana/instructions/setSolGiveawayWinners";
import { setSplGiveawayWinnersInstruction } from "@/lib/solana/instructions/setSplGiveawayWinners";
import { getDropperGiveaway } from "@/lib/solana/program";
import { sendTransaction } from "@/lib/solana/sendTransaction";
import { getManagerWallet } from "@/lib/solana/wallet";
import { createSupabaseService } from "@repo/lib/supabase";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params: { id } }: { params: { id: number } }
) {
  const supabase = await createSupabaseService();

  try {
    if (request.headers.get("password") !== process.env.GIVEAWAY_PASSWORD)
      throw new Error("Unauthorized");
    const bodyData = await request.json();
    if (!bodyData.winners) throw new Error("No winners provided");
    const winners = bodyData.winners as string[];
    const winnerKeys = winners.map((key) => new PublicKey(key));

    const { data, error } = await supabase
      .from("giveaways")
      .select("token_address, winner_amount, creator_key")
      .eq("id", id)
      .single();

    if (error) throw new Error("Couldn't find giveaway");

    const managerWallet = await getManagerWallet();

    let instruction: TransactionInstruction;

    const connection = createNewSolanaConnection();

    const program = getDropperGiveaway(managerWallet, connection);
    if (!program) throw new Error("Program not found");

    if (data.token_address) {
      instruction = await setSplGiveawayWinnersInstruction({
        winnerKeys,
        program,
        giveawayId: id,
        wallet: managerWallet,
        creatorKey: new PublicKey(data.creator_key),
      });
    } else {
      instruction = await setSolGiveawayWinnersInstruction({
        winnerKeys,
        giveawayId: id,
        program,
        wallet: managerWallet,
        creatorKey: new PublicKey(data.creator_key),
      });
    }

    const txString = await sendTransaction({
      provider: program.provider,
      transactionInstructions: [instruction],
      wallet: managerWallet,
    });

    await supabase
      .from("giveaways")
      .update({ set_winners_tx: txString })
      .eq("id", id);

    return NextResponse.json(JSON.stringify(txString), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err: any) {
    console.error(err);
    await supabase
      .from("giveaways")
      .update({ set_winners_error: err.message })
      .eq("id", id);
    return NextResponse.json(JSON.stringify(err.message), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
