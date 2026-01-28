import { create } from "zustand";
import { api } from "@/lib/api";
import { getWinner, applyMove, getNextTurn } from "@/lib/game/engine";
import { toast } from "sonner";
import { bestMove } from "@/lib/game/minimax";
import { Room } from "@/lib/types";
import { useAuthStore } from "./auth.store";

export interface GameState {
  room: Room | null;
  matchmaking: boolean;
  timer: number;
  intervalId: NodeJS.Timeout | null;
  selfId: string | null;

  setSelf: (userId: string) => void;
  setRoom: (room: Room | null) => void;
  play: (userId: string) => Promise<void>;
  leave: (userId: string) => Promise<void>;
  move: (index: number, userId: string) => Promise<void>;
  rematch: () => Promise<void>;
  getOpponentId: () => void;
  skipOpponent: (userId: string) => Promise<void>
  updateAwarded: (data: string[]) => void,
  startTimer: () => void;
  stopTimer: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  room: null,
  matchmaking: false,
  timer: 10,
  intervalId: null,
  selfId: null,

  setSelf: (userId) => {
    set({ selfId: userId });
  },
  updateAwarded: (data: string[]) => {
    api.post("/game", { roomId: get().room?.$id, data })
  },
  setRoom: (room) => {
    set({ room });

    const { selfId, startTimer, stopTimer } = get();
    if (!room || room.winner) {
      stopTimer();
      return;
    }

    const turnPlayerId =
      room.turn === "X" ? room.playerX : room.playerO;

    if (turnPlayerId === selfId) {
      startTimer();
    } else {
      stopTimer();
    }
  },

  startTimer: () => {
    const { stopTimer } = get();
    stopTimer();
    set({ timer: 10 });

    const intervalId = setInterval(() => {
      const { room, timer, move, selfId } = get();
      if (!room || room.winner || !selfId) {
        stopTimer();
        return;
      }

      if (timer <= 1) {
        const board = room.board.split(",");
        const index = bestMove(board, room.turn);
        if (index !== -1) {
          move(index, selfId);
        }
        set({ timer: 10 });
      } else {
        set({ timer: timer - 1 });
      }
    }, 1000);

    set({ intervalId });
  },

  stopTimer: () => {
    const { intervalId } = get();
    if (intervalId) clearInterval(intervalId);
    set({ intervalId: null, timer: 10 });
  },

  play: async (userId) => {
    try {
      set({ matchmaking: true });
      const { data } = await api.post("/game/match", { userId });
      set({ room: data, matchmaking: false });
    } catch {
      toast.error("Matchmaking failed");
      set({ matchmaking: false });
    }
  },

  leave: async (userId) => {
    const { room, stopTimer } = get();
    if (!room) return;

    try {
      await api.post("/game/leave", {
        roomId: room.$id,
        userId,
      });
    } catch { }

    stopTimer();
    set({ room: null, matchmaking: false });
  },

  move: async (index, userId) => {
    const { room, setRoom } = get();
    if (!room) return;

    const symbol =
      room.playerX === userId ? "X" :
        room.playerO === userId ? "O" : null;
    if (room.turn !== symbol) return;

    if (!symbol || room.turn !== symbol) return;

    const board = room.board.split(",");
    if (board[index]) return;

    const nextBoard = applyMove(board, index, symbol);
    const winner = getWinner(nextBoard);
    const nextTurn = winner ? room.turn : getNextTurn(symbol);

    setRoom({
      ...room,
      board: nextBoard.join(","),
      turn: nextTurn,
      winner: winner as typeof room.winner,
    });

    try {
      await api.post("/game/move", {
        roomId: room.$id,
        index,
        userId,
      });
    } catch {
      toast.error("Move rejected");
      setRoom(room);
    }
  },

  rematch: async () => {
    const { room } = get();
    if (!room) return;

    try {
      const { data } = await api.post("/game/rematch", {
        roomId: room.$id,
      });
      set({ room: data });
    } catch { }
  },

  getOpponentId: () => {
    const { room, selfId } = get();
    if (!room || !selfId) return null;
    if (room.playerX === selfId) return room.playerO ?? null;
    if (room.playerO === selfId) return room.playerX ?? null;
    return null;
  },

  skipOpponent: async (userId: string) => {
    const { leave, play } = get();
    await leave(userId);
    await play(userId);
  },
}));
