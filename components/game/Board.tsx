import { useGame } from "@/hooks/useGame";
import { Cell } from "./Cell";
import { Button } from "@/components/ui/button";
import { useGameStore } from "@/store/game.store";
import { WIN_LINES_COORDS } from "@/lib/game/constants";
import { Volleyball } from "lucide-react";
import ElectricBorder from "../ElectricBorder";

export function Board() {
  const { board, canMove, winnerLine, move } = useGame();
  const { room, rematch } = useGameStore();

  const lineKey = winnerLine?.join(",");
  const lineCoords = lineKey ? WIN_LINES_COORDS[lineKey] : null;

  return (
    <div className="flex flex-col mx-auto">
      <ElectricBorder
        color="#7df9ff"
        speed={1}
        chaos={0.12}
        style={{ borderRadius: 16 }}
      >
        <div className="relative grid grid-cols-3 rounded-2xl overflow-hidden">
          {board.map((v, i) => (
            <Cell
              key={i}
              value={v}
              disabled={!canMove || !!v}
              onClick={() => move(i)}
            />
          ))}
          {lineCoords && (
            <svg className="w-full h-full pointer-events-none absolute top-0 shadow-lg">
              <line
                x1={lineCoords.x1}
                y1={lineCoords.y1}
                x2={lineCoords.x2}
                y2={lineCoords.y2}
                stroke="#F5E7C6"
                strokeWidth={7}
                strokeLinecap="round"
                className="animate-draw blur-xs"
              />
            </svg>
          )}
        </div>
      </ElectricBorder>

      {room?.winner && (
        <Button className="mt-2 mx-auto" onClick={rematch}>
          <Volleyball /> Play again
        </Button>
      )}
    </div>
  );
}
