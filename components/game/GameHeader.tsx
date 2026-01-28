import { useGame } from "@/hooks/useGame";
import { useAuthStore } from "@/store/auth.store";
import { useEffect } from "react";
import { useUsersStore } from "@/store/leader.store";
import { Badge } from "../ui/badge";
import { ArrowBigDownDashIcon } from "lucide-react";
import { StarToken } from "@/components/StarToken";
import { useGameStore } from "@/store/game.store";
import MiniProfile from "../MiniProfile";

export function GameHeader() {
    const { status, timer, opponentId, symbol } = useGame();
    const { room } = useGameStore();
    const { player, getPlayer } = useUsersStore();
    const { user } = useAuthStore();

    useEffect(() => {
        if (typeof opponentId === "string") getPlayer(opponentId);
    }, [opponentId]);

    return (
        <div className="w-full flex flex-col justify-center items-center text-center max-h-20 h-20 border-b">
            <div className="flex items-center gap-1">
                {player ? <>
                    <MiniProfile user={user} right />
                    <div className="flex items-center gap-2">
                        {symbol === "X" ? <XIcon /> : <OIcon />}
                        <span className="text-muted-foreground text-xs">vs</span>
                        {symbol === "X" ? <OIcon /> : <XIcon />}
                    </div>
                    <MiniProfile user={player} />
                </> : status !== "Waiting for opponent" ? <div className="flex flex-col">
                    You vs ???
                    <div className="w-fit flex gap-1 m-auto rounded-3xl bg-accent/40 border backdrop-blur-3xl p-2 text-center">
                        <Badge className="bg-accent text-foreground border-">⌛ Waiting</Badge>
                        Find your opponent! <ArrowBigDownDashIcon />
                    </div>
                </div> : null}
            </div>
            <div className="flex gap-3">
                <span className="text-lg">
                    {status === "won" ? (
                        <div className="flex">Won +16 <StarToken /></div>
                    ) : status === "lost" ? (
                        <div className="flex">Lost -7 <StarToken /></div>
                    ) : (status)}
                </span>
                {timer !== 0 && timer < 10 && <p className="text-lg"><b>{timer}</b>s left</p>}
            </div>
        </div >
    );
}

function XIcon() {
    return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-orange-500 drop-shadow-[0_0_6px_rgba(255,140,0,0.8)]">
            <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="20" y1="4" x2="4" y2="20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
    );
}

function OIcon() {
    return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-sky-400 drop-shadow-[0_0_6px_rgba(56,189,248,0.8)]">
            <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2.5" />
        </svg>
    );
}
