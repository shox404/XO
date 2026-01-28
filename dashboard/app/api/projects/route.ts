import { DATABASE_ID, databases, PROJECTS_COLLECTION } from "@/lib/appwrite";
import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";

export async function GET() {
    try {
        const response = await databases.listDocuments(DATABASE_ID, PROJECTS_COLLECTION);
        return NextResponse.json(response.documents);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name } = body;

        if (!name) {
            return NextResponse.json({ error: "Project name is required" }, { status: 400 });
        }

        const project = await databases.createDocument(
            DATABASE_ID,
            PROJECTS_COLLECTION,
            ID.unique(),
            { name }
        );

        return NextResponse.json(project, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
