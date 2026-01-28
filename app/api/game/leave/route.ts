import { databases, DATABASE_ID, ROOMS_COLLECTION } from "@/lib/appwrite";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { roomId, userId } = await req.json();

  try {
    const room = await databases.getDocument(DATABASE_ID, ROOMS_COLLECTION, roomId);

    await databases.deleteDocument(DATABASE_ID, ROOMS_COLLECTION, roomId);

    const leftBy =
      room.playerX === userId ? "X" :
        room.playerO === userId ? "O" : "";

    if (!leftBy) {
      return NextResponse.json({ error: "Not in room" }, { status: 400 });
    }

    await databases.updateDocument(DATABASE_ID, ROOMS_COLLECTION, roomId, {
      status: "ended",
      leftBy
    });

    setTimeout(async () => {
      try {
        await databases.deleteDocument(DATABASE_ID, ROOMS_COLLECTION, roomId);
      } catch { }
    }, 500);

    return NextResponse.json({ left: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }
}
