import { NextResponse } from "next/server";
import { BUCKET_ID, storage } from "@/lib/appwrite";

export async function DELETE(
  _req: Request,
  context: { params: { fileId: string } | Promise<{ fileId: string }> }
) {
  try {
    const params = await context.params;
    const fileId = params.fileId;

    await storage.deleteFile(BUCKET_ID, fileId);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Delete failed" }, { status: 500 });
  }
}
