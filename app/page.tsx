"use client"
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/useIsMobile";
import { usePresenceStore } from "@/store/presence.store";
import { Badge } from "@/components/ui/badge";
import { LucideLollipop } from "lucide-react";
import Leaderboard from "./(pages)/Leaderboard";
import Ballpit from "@/components/Ballpit";
import ProfileCard from "@/components/ProfileCard";
import CountUp from "@/components/CountUp";

export default function Page() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { presence } = usePresenceStore()

  return (
    <div>
      <main className="min-h-[calc(100dvh-49px)] relative">
        <div className={`w-full h-[calc(100dvh-49px)] z-20 flex flex-col gap-2 items-center p-6 transition-colors duration-500`}>
          {!isMobile && <Ballpit
            count={100}
            gravity={0.1}
            friction={0.9975}
            wallBounce={0.95}
            followCursor={false}
            colors={["#EF4444", "#F59E0B", "#F97316", "#B91C1C", "#DC2626"]}
            className="z-0 absolute top-0"
          />}

          <ProfileCard />
          <Button className="h-14 px-12 py-5 text-xl font-bold rounded-2xl cursor-pointer z-30 flex" onClick={() => router.push("/game")}>
            Start Game
          </Button>
          <CountUp value={presence.length} className="text-3xl" />
          <div className="flex gap-2 justify-center">
            <Badge>Realtime online players</Badge>
          </div>
          <Button onClick={() => router.push("/users")} className="z-20 cursor-pointer"><LucideLollipop />Search for friend!</Button>
          <Leaderboard />
        </div>
      </main>
    </div>
  );
}
