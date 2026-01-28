import { DATABASE_ID, databases, JWT_SECRET, ROOMS_COLLECTION } from "@/lib/appwrite";
import { User } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
    try {
        const { roomId, data }: { roomId: string, data: string[] } = await req.json();

        const token = req.cookies.get("auth")?.value;
        if (!token) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        let payload: User;
        try {
            payload = jwt.verify(token, JWT_SECRET) as User;
        } catch {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        await databases.updateDocument(DATABASE_ID, ROOMS_COLLECTION, roomId, { awarded: [...data, payload.$id] });

        return NextResponse.json({ ok: true }, { status: 200 });
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
