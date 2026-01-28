import { NextResponse } from "next/server";
import { BUCKET_ID, storage } from "@/lib/appwrite";

export async function GET(
  _req: Request,
  context: { params: { fileId: string } | Promise<{ fileId: string }> }
) {
  try {
    const params = await context.params;
    const fileId = params.fileId;

    if (!fileId) {
      return NextResponse.json({ error: "fileId is required" }, { status: 400 });
    }

    const arrayBuffer = await storage.getFileDownload(
      BUCKET_ID!, fileId
    );

    const uint8Array = new Uint8Array(arrayBuffer);

    return new NextResponse(uint8Array, {
      headers: { "Content-Type": "image/jpeg" },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch file" },
      { status: 500 }
    );
  }
}
