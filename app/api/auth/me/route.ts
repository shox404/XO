import { NextRequest, NextResponse } from "next/server";
import { DATABASE_ID, databases, JWT_SECRET } from "@/lib/appwrite";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("auth")?.value;

        if (!token) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const user = jwt.verify(token, JWT_SECRET) as { $id: string };

        const data = await databases.getDocument(DATABASE_ID, "users", user.$id);

        return NextResponse.json(data, { status: 200 });
    } catch {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
}
