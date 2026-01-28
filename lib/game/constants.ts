export const WIN_PATTERNS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

export const BOARD_SIZE = 9;

export const WIN_LINES_COORDS: Record<string, { x1: number; y1: number; x2: number; y2: number }> = {
  // rows
  "0,1,2": { x1: 0, y1: 48, x2: 288, y2: 48 },
  "3,4,5": { x1: 0, y1: 144, x2: 288, y2: 144 },
  "6,7,8": { x1: 0, y1: 240, x2: 288, y2: 240 },

  // columns
  "0,3,6": { x1: 48, y1: 0, x2: 48, y2: 288 },
  "1,4,7": { x1: 144, y1: 0, x2: 144, y2: 288 },
  "2,5,8": { x1: 240, y1: 0, x2: 240, y2: 288 },

  // diagonals
  "0,4,8": { x1: 0, y1: 0, x2: 288, y2: 288 },
  "2,4,6": { x1: 288, y1: 0, x2: 0, y2: 288 },
};
