import { NextResponse } from "next/server";
import { BUCKET_ID, storage } from "@/lib/appwrite";
import { ID } from "node-appwrite";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) return NextResponse.json({ error: "File is required" }, { status: 400 });

    const uploaded = await storage.createFile(
      BUCKET_ID!, ID.unique(), file
    );

    return NextResponse.json({ $id: uploaded.$id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Upload failed" }, { status: 500 });
  }
}
