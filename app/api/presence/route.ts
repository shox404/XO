import { DATABASE_ID, databases, PRESENCE_COLLECTION } from "@/lib/appwrite";
import { NextRequest, NextResponse } from "next/server";
import { Query } from "node-appwrite";

export async function GET() {
    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            PRESENCE_COLLECTION,
            [
                Query.notEqual("action", "off")
            ]
        );

        const onlineUsers = response.documents.map((doc) => ({
            userId: doc.userId,
            action: doc.action,
        }));

        return NextResponse.json({ onlineUsers });
    } catch (err) {
        return NextResponse.json(
            { error: "Failed to fetch online users" },
            { status: 500 }
        );
    }
}


export async function POST(req: NextRequest) {
    const { userId, action } = await req.json();
    try {
        if (!userId || !action) {
            return NextResponse.json(
                { error: "userId and action are required" },
                { status: 400 }
            );
        }

        await databases.updateDocument(
            DATABASE_ID,
            PRESENCE_COLLECTION,
            userId,
            { userId, action }
        );

        return NextResponse.json({ ok: true });
    } catch (err: any) {
        if (err?.code === 404) {
            await databases.createDocument(
                DATABASE_ID,
                PRESENCE_COLLECTION,
                userId,
                { userId, action }
            );

            return NextResponse.json({ ok: true, created: true });
        }

        return NextResponse.json(
            { error: "Presence update failed" }, { status: 500 }
        );
    }
}