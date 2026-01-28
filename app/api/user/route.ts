import { DATABASE_ID, databases, USERS_COLLECTION } from "@/lib/appwrite";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const id = url.searchParams.get("$id");

        if (!id) {
            return NextResponse.json({ error: "Missing $id query parameter" }, { status: 400 });
        }

        const result = await databases.getDocument(DATABASE_ID, USERS_COLLECTION, id);

        return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const { id, ...updates } = await req.json();

        if (!id) {
            return NextResponse.json({ error: "Id required" }, { status: 400 });
        }

        if (!Object.keys(updates).length) {
            return NextResponse.json({ error: "No fields to update" }, { status: 400 });
        }

        const updatedUser = await databases.updateDocument(DATABASE_ID, USERS_COLLECTION, id, updates);

        return NextResponse.json(updatedUser, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}