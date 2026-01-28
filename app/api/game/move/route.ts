import { databases, DATABASE_ID, ROOMS_COLLECTION } from "@/lib/appwrite";
import { checkWinner } from "@/lib/checkWinner";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { roomId, index, userId } = await req.json();

    const room = await databases.getDocument(DATABASE_ID, ROOMS_COLLECTION, roomId);

    if (!room) {
        return NextResponse.json({}, { status: 404 });
    }

    const symbol = room.playerX === userId ? "X" : room.playerO === userId ? "O" : "";

    if (!symbol || room.winner) {
        return NextResponse.json({}, { status: 400 });
    }

    const cells = room.board.split(",");

    if (index === -1) {
        if (room.turn !== symbol) {
            return NextResponse.json({}, { status: 400 });
        }

        await databases.updateDocument(DATABASE_ID, ROOMS_COLLECTION, roomId, {
            turn: symbol === "X" ? "O" : "X",
        });

        return NextResponse.json({ ok: true }, { status: 200 });
    }

    if (index < 0 || index > 8 || room.turn !== symbol || cells[index]) {
        return NextResponse.json({ status: false }, { status: 400 });
    }

    cells[index] = symbol;
    const winner = checkWinner(cells);

    await databases.updateDocument(DATABASE_ID, ROOMS_COLLECTION, roomId, {
        board: cells.join(","),
        turn: winner ? "" : symbol === "X" ? "O" : "X",
        winner,
        status: winner ? "finished" : "playing",
        awarded: []
    });

    return NextResponse.json({ ok: true }, { status: 200 });
}
