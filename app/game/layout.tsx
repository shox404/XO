"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { StarToken } from "@/components/StarToken";
import { Chat } from "../(pages)/Chat";
import CountUp from "@/components/CountUp";
import { dealer } from "@/lib/balance";

export default function GameLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { user } = useAuthStore();

    return (
        <div className="min-h-[calc(100dvh-49px)] flex flex-col bg-muted/40">
            <header className="w-full border-b bg-background px-3 h-14 flex items-center justify-between">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>

                <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 flex items-center justify-center">
                        <StarToken />
                        <CountUp value={dealer(user?.balance as [number, number]) ?? 0} separator="," />
                    </div>

                    <Chat />
                </div>
            </header>

            {children}
        </div>
    );
}
