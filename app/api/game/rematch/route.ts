import { databases, DATABASE_ID, ROOMS_COLLECTION } from "@/lib/appwrite";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { roomId } = await req.json();
  const room = await databases.getDocument(DATABASE_ID, ROOMS_COLLECTION, roomId);

  if (!room.playerX || !room.playerO) {
    return NextResponse.json({ error: "Waiting for opponent" }, { status: 400 });
  }

  const updated = await databases.updateDocument(DATABASE_ID, ROOMS_COLLECTION, roomId, {
    board: ",,,,,,,,",
    turn: "X",
    winner: "",
    status: "playing",
    awarded: []
  });

  return NextResponse.json(updated, { status: 200 });
}
