import { WIN_PATTERNS } from "./game/constants";

export function checkWinner(cells: string[]) {
    for (const [a, b, c] of WIN_PATTERNS) {
        if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) return cells[a];
    }
    return cells.includes("") ? "" : "draw";
}


export function identifyWinner(cells: string[]): { winner: string | "draw" | null, line: number[] | null } {
  for (const [a, b, c] of WIN_PATTERNS) {
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      return { winner: cells[a], line: [a, b, c] };
    }
  }
  return cells.includes("") ? { winner: null, line: null } : { winner: "draw", line: null };
}
