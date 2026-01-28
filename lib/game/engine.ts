import { WIN_PATTERNS } from "./constants";

export function getWinner(board: string[]) {
    for (const [a, b, c] of WIN_PATTERNS) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }

    if (board.every(Boolean)) return "draw";

    return null;
}
export function applyMove(
    board: string[],
    index: number,
    symbol: "X" | "O"
) {
    if (board[index]) return board;
    const next = [...board];
    next[index] = symbol;
    return next;
}

export function getNextTurn(symbol: "X" | "O") {
    return symbol === "X" ? "O" : "X";
}
