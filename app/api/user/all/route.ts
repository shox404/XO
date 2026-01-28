import { DATABASE_ID, databases, USERS_COLLECTION } from "@/lib/appwrite";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const result = await databases.listDocuments(DATABASE_ID, USERS_COLLECTION);

        return NextResponse.json(result.documents, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
    }
}