import { getWinner } from "./engine";

export function minimax(
    board: string[],
    isMax: boolean,
    ai: "X" | "O",
    human: "X" | "O"
): number {
    const winner = getWinner(board);
    if (winner === ai) return 1;
    if (winner === human) return -1;
    if (board.every(Boolean)) return 0;

    const scores: number[] = [];

    board.forEach((cell, i) => {
        if (!cell) {
            board[i] = isMax ? ai : human;
            scores.push(minimax(board, !isMax, ai, human));
            board[i] = "";
        }
    });

    return isMax ? Math.max(...scores) : Math.min(...scores);
}

export function bestMove(board: string[], ai: "X" | "O") {
    const human = ai === "X" ? "O" : "X";
    let bestScore = -Infinity;
    let move = -1;

    board.forEach((cell, i) => {
        if (!cell) {
            board[i] = ai;
            const score = minimax(board, false, ai, human);
            board[i] = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    });

    return move;
}
