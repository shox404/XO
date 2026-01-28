import { useGameStore } from "@/store/game.store";
import { useAuthStore } from "@/store/auth.store";
import { identifyWinner } from "@/lib/checkWinner";
import { StarToken } from "@/components/StarToken";

export function useGame() {
    const { room, timer, move, getOpponentId } = useGameStore();
    const { user } = useAuthStore();

    if (!room || !user) {
        return {
            board: [],
            canMove: false,
            timer: 0,
            status: "",
            opponentId: null,
            move: () => { },
        };
    }

    const board = room.board.split(",");

    const symbol =
        room.playerX === user.$id
            ? "X"
            : room.playerO === user.$id
                ? "O"
                : null;

    const isReady = !!room.playerX && !!room.playerO;
    const isYourTurn = room.turn === symbol;

    const canMove =
        !!symbol &&
        isReady &&
        isYourTurn &&
        !room.winner;

    let status: string;

    if (!isReady) {
        status = "Waiting for opponent";
    } else if (room.winner === "draw") {
        status = "Draw";
    } else if (room.winner === symbol) {
        status = `won`;
    } else if (room.winner) {
        status = `lost`;
    } else if (isYourTurn) {
        status = "Your turn";
    } else {
        status = "Opponent's turn";
    }

    const { line: winnerLine } = identifyWinner(board);

    return {
        board,
        timer,
        canMove,
        status,
        symbol,
        opponentId: getOpponentId(),
        winnerLine,
        move: (i: number) => {
            if (!canMove) return;
            move(i, user.$id);
        },
    };
}
