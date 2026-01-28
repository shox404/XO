import { NextRequest, NextResponse } from "next/server";
import { DATABASE_ID, databases, JWT_SECRET, OTP_COLLECTION, DEVS_COLLECTION } from "@/lib/appwrite";
import { Query, ID } from "node-appwrite";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
    const { email, code } = await req.json();

    if (!email || !code) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const result = await databases.listDocuments(DATABASE_ID, OTP_COLLECTION, [
        Query.equal("email", email),
        Query.equal("code", code),
    ]);

    const otp = result.documents[0];

    if (!otp) {
        return NextResponse.json({ error: "Invalid code" }, { status: 401 });
    }

    const OTP_LIFETIME = 15 * 60 * 1000;

    const createdAt = new Date(otp.$createdAt);
    const now = new Date();
    if (now.getTime() - createdAt.getTime() > OTP_LIFETIME) {
        return NextResponse.json({ error: "Code expired" }, { status: 401 });
    }

    await databases.deleteDocument(DATABASE_ID, OTP_COLLECTION, otp.$id);

    const usersResult = await databases.listDocuments(DATABASE_ID, DEVS_COLLECTION, [
        Query.equal("email", email),
    ]);

    let user = usersResult.documents[0];

    if (!user) {
        user = await databases.createDocument(DATABASE_ID, DEVS_COLLECTION, ID.unique(), {
            email
        });
    }

    const userData = { $id: user.$id };
    const token = jwt.sign(userData, JWT_SECRET, { expiresIn: "7d" });

    const res = NextResponse.json({ success: true, user: userData }, { status: 200 });

    res.cookies.set({
        name: "auth",
        value: token,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    });

    return res;
}
