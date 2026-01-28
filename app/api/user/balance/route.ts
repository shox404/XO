import { DATABASE_ID, databases, JWT_SECRET } from "@/lib/appwrite";
import { NextRequest, NextResponse } from "next/server";
import { User } from "@/lib/types";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
    try {
        const { balance }: { balance: [number, number] } = await req.json();

        if (!Array.isArray(balance) || balance.length !== 2) {
            return NextResponse.json({ error: "Invalid balance array" }, { status: 400 });
        }

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

        await databases.updateDocument(DATABASE_ID, "users", payload.$id, { balance });

        const updatedUser = { ...payload, balance };
        const newToken = jwt.sign(updatedUser, JWT_SECRET);

        const res = NextResponse.json({ user: updatedUser }, { status: 200 });

        res.cookies.set({
            name: "auth",
            value: newToken,
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return res;
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
