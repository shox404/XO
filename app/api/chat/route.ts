import { NextRequest, NextResponse } from "next/server";
import { databases, DATABASE_ID, MSGS_COLLECTION, ROOMS_COLLECTION } from "@/lib/appwrite";
import { Query } from "appwrite";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get("roomId");

    if (!roomId) {
        return NextResponse.json({ error: "roomId required" }, { status: 400 });
    }

    const messages = await databases.listDocuments(DATABASE_ID, MSGS_COLLECTION, [
        Query.equal("roomId", roomId),
        Query.orderAsc("$createdAt"),
    ]);

    return NextResponse.json(messages.documents, { status: 200 });
}

export async function POST(req: NextRequest) {
    const { roomId, userId, msg } = await req.json();

    if (!msg || msg.trim() === "") {
        return NextResponse.json({ error: "Empty message" }, { status: 400 });
    }

    const room = await databases.getDocument(DATABASE_ID, ROOMS_COLLECTION, roomId).catch(() => null);

    if (!room) {
        return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const message = await databases.createDocument(DATABASE_ID, MSGS_COLLECTION, "unique()", {
        roomId,
        userId,
        msg,
        $createdAt: new Date().toISOString(),
    });

    return NextResponse.json(message, { status: 201 });
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const roomId = searchParams.get("roomId");

        if (!roomId) {
            return NextResponse.json({ error: "roomId required" }, { status: 400 });
        }

        const res = await databases.listDocuments(DATABASE_ID, MSGS_COLLECTION, [
            Query.equal("roomId", roomId),
            Query.limit(1000),
        ]);

        for (const msg of res.documents) {
            await databases.deleteDocument(DATABASE_ID, MSGS_COLLECTION, msg.$id);
        }

        return NextResponse.json({ ok: true }, { status: 200 });
    } catch {
        return NextResponse.json({ error: "Failed to delete messages" }, { status: 500 });
    }
}
