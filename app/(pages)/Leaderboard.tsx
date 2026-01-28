"use client";

import { useEffect, useMemo, useState } from "react";
import { useUsersStore } from "@/store/leader.store";
import { useAuthStore } from "@/store/auth.store";
import { Crown, ChevronUp, User, X } from "lucide-react";
import { StarToken } from "@/components/StarToken";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { dealer } from "@/lib/balance";
import CountUp from "@/components/CountUp";
import Image from "next/image";

export default function Leaderboard() {
    const { leaders, getLeaders } = useUsersStore();
    const { user } = useAuthStore();
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        if (leaders.length === 0) getLeaders();
    }, [getLeaders, leaders.length]);

    const topLeaders = useMemo(() => leaders.slice(0, 3), [leaders]);

    return (
        <>
            <div className="w-full flex justify-center p-2">
                <div className="w-full max-w-md sm:max-w-lg md:max-w-xl rounded-2xl border backdrop-blur-3xl bg-accent/70">
                    <div className="flex items-center justify-between border-b px-4 py-3">
                        <div className="flex items-center gap-2">
                            <Crown className="h-4 w-4 text-muted-foreground" />
                            <h2 className="text-xs font-semibold uppercase tracking-wide">
                                Leaderboard
                            </h2>
                        </div>
                        <span className="text-[10px] text-muted-foreground">All time</span>
                    </div>

                    <div className="p-2 space-y-1">
                        {topLeaders.map((item, index) => {
                            const isMe = item.name === user?.name;
                            const isTop = index === 0;

                            return (
                                <div
                                    key={item.$id}
                                    className={`flex items-center gap-3 rounded-xl px-3 py-2 border ${isMe ? "ring-1 ring-primary/30" : ""
                                        }`}
                                >
                                    <div className="w-6 flex justify-center">
                                        {isTop ? <Crown className="h-4 w-4" /> : index + 1}
                                    </div>

                                    <div className="h-8 w-8 rounded-full border flex items-center justify-center">
                                        {item.avatar ? <Image src={`/api/storage/preview/${item.avatar}`} height={300} width={300} alt="i" /> : <User className="h-4 w-4" />}
                                    </div>

                                    <p className="flex-1 truncate text-sm font-medium">
                                        {item.name}
                                    </p>

                                    <div className="flex items-center gap-1 text-xs">
                                        <ChevronUp className="h-3 w-3" />
                                        <CountUp value={dealer(item.balance)} separator="," />
                                        <StarToken />
                                    </div>
                                </div>
                            );
                        })}

                        <Button
                            size="sm"
                            className="w-full mt-2"
                            onClick={() => setIsFullscreen(true)}
                        >
                            Top Players
                        </Button>
                    </div>
                </div>
            </div>

            {/* ===== FULLSCREEN MODAL (ALL PLAYERS) ===== */}
            <AnimatePresence>
                {isFullscreen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-linear-to-br
        from-primary/20
        via-pink-200/20
        to-purple-300/20
        backdrop-blur-xl
      "
                    >
                        {/* Floating leaderboard card */}
                        <motion.div
                            initial={{ scale: 0.9, y: 40 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 40 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            className="
          w-[92vw] max-w-2xl
          mx-4
          rounded-3xl
          bg-background/80
          border
          shadow-2xl
          flex flex-col
          max-h-[85vh]
        "
                        >
                            {/* ===== Header (sticky, no scroll) ===== */}
                            <div className="flex items-center justify-between px-5 py-4 border-b sticky top-0 bg-background/80 backdrop-blur z-10 rounded-t-3xl">
                                <h2 className="text-lg font-bold">Top Players</h2>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => setIsFullscreen(false)}
                                >
                                    <X />
                                </Button>
                            </div>

                            {/* ===== Scrollable list ONLY ===== */}
                            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
                                {leaders.map((item, index) => {
                                    const isMe = item.name === user?.name;

                                    return (
                                        <div
                                            key={item.$id}
                                            className={`
                  flex items-center gap-3
                  rounded-2xl
                  px-4 py-3
                  border
                  bg-muted/30
                  ${isMe
                                                    ? "ring-2 ring-primary/40 bg-primary/10"
                                                    : "hover:bg-muted/40"
                                                }
                `}
                                        >
                                            <span className="w-8 text-sm font-medium text-muted-foreground">
                                                {index + 1}
                                            </span>

                                            <div className="h-9 w-9 rounded-full border flex items-center justify-center bg-background">
                                                <User className="h-4 w-4" />
                                            </div>

                                            <p className="flex-1 truncate font-medium">
                                                {item.name}
                                            </p>

                                            <div className="flex items-center gap-1 text-sm">
                                                <CountUp value={dealer(item.balance)} separator="," />
                                                <StarToken />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
