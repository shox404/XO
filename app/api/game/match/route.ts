import { databases, DATABASE_ID, ROOMS_COLLECTION } from "@/lib/appwrite";
import { Query, ID } from "node-appwrite";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userId } = await req.json();

  const existing = await databases.listDocuments(DATABASE_ID, ROOMS_COLLECTION, [
    Query.or([Query.equal("playerX", userId), Query.equal("playerO", userId)]),
    Query.limit(1),
  ]);

  if (existing.total > 0) {
    return NextResponse.json(existing.documents[0], { status: 200 });
  }

  const waiting = await databases.listDocuments(DATABASE_ID, ROOMS_COLLECTION, [
    Query.equal("status", "waiting"),
    Query.notEqual("playerX", userId),
    Query.limit(1),
  ]);

  if (waiting.total > 0) {
    const room = waiting.documents[0];
    if (room.playerO === "" && room.status === "waiting") {
      const updated = await databases.updateDocument(DATABASE_ID, ROOMS_COLLECTION, room.$id, {
        playerO: userId,
        status: "playing",
      });
      return NextResponse.json(updated, { status: 200 });
    }
  }

  const room = await databases.createDocument(DATABASE_ID, ROOMS_COLLECTION, ID.unique(), {
    playerX: userId,
    playerO: "",
    board: ",,,,,,,,",
    turn: "X",
    winner: "",
    status: "waiting",
  });

  return NextResponse.json(room, { status: 201 });
}
