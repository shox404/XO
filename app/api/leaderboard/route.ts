import { NextResponse } from "next/server";
import { DATABASE_ID, USERS_COLLECTION, databases } from "@/lib/appwrite";
import { Query } from "node-appwrite";
import { dealer } from "@/lib/balance";

export async function GET() {
  try {
    const result = await databases.listDocuments(DATABASE_ID, USERS_COLLECTION, [
      Query.isNotNull("balance"),
      Query.limit(200),
    ]);

    const users = result.documents
      .sort((a, b) => b.balance - a.balance)
      .map(doc => ({
        $id: doc.$id,
        name: doc.name,
        balance: doc.balance,
        avatar: doc.avatar
      }))
      .filter(doc => dealer(doc.balance) !== 0);

    return NextResponse.json(users, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch users" }, { status: 500 }
    );
  }
}
