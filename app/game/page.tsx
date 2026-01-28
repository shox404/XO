"use client";

import { useGameStore } from "@/store/game.store";
import { useAuthStore } from "@/store/auth.store";
import { Board } from "@/components/game/Board";
import { GameHeader } from "@/components/game/GameHeader";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { subscribeRoom } from "@/lib/realtime";

export const awardSystem = () => {
  const { user, updateBalance } = useAuthStore.getState();
  const { room, updateAwarded } = useGameStore.getState();

  if (!room?.winner || room.winner === "draw") return;

  if (room.status === "finished") {
    const isWinner =
      (room.winner === "X" && room.playerX === user?.$id) ||
      (room.winner === "O" && room.playerO === user?.$id);

    if (!room.awarded.includes(user?.$id as string)) {
      updateBalance(isWinner ? 1 : -1);
      updateAwarded(room.awarded);
    }
  }
}

export default function GamePage() {
  const store = useGameStore();
  const { room, matchmaking, play, leave, setSelf, skipOpponent, updateAwarded } = store;
  const { user } = useAuthStore();

  useEffect(() => {
    awardSystem()
  }, [room?.winner]);

  useEffect(() => {
    const unsubscribe = subscribeRoom(store);

    return () => { unsubscribe() };
  }, [room]);

  useEffect(() => {
    if (user?.$id) {
      setSelf(user.$id);
    }
  }, [user?.$id]);

  if (!user) return null;

  return (
    <div className="py-2 flex flex-col w-full mx-auto flex-1">
      <GameHeader />

      {!room ? (
        <div className="w-full flex justify-center items-center flex-1">
          <Button
            className="cursor-pointer"
            disabled={matchmaking}
            onClick={() => play(user.$id)}
          >
            {matchmaking ? "Searching..." : "Play Random"}
          </Button>
        </div>
      ) : (
        <div className="w-full flex flex-col flex-1 items-center gap-2 pt-6 overflow-hidden">
          <Board />
          <div className="footer flex gap-2">
            <Button
              variant="secondary"
              onClick={() => skipOpponent(user.$id)}
            >
              Switch Opponent
            </Button>
            <Button
              variant="destructive"
              onClick={() => leave(user.$id)}
            >
              Leave
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
