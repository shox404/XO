"use client";

import { useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { api } from "@/lib/api";
import { subscribePresence } from "@/lib/realtime";
import { usePresenceStore } from "@/store/presence.store";

import dynamic from "next/dynamic"
import Image from "next/image";
import ProfileDropdown from "@/components/ProfileDropdown";
import Link from "next/link";

const ThemeToggle = dynamic(
    () => import("@/components/ThemeToggle").then(m => m.ThemeToggle), { ssr: false }
)

interface Props { children: React.ReactNode }

export default function Client({ children }: Props) {
    const { user, setUser, setLoading } = useAuthStore();
    const { fetched, presence, setFetch, updateAction, getOnlineUsers, setPresence } = usePresenceStore()
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!user?.$id) return;

        const initPresence = async () => {
            await getOnlineUsers();
            updateAction(user.$id, "on");
            if (!presence.find(e => e.userId === user.$id)) {
                setPresence(user.$id, "on");
            }
        }

        initPresence();

        const unsub = subscribePresence();

        const handleBeforeUnload = () => updateAction(user.$id, "off");
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            updateAction(user.$id, "off");
            window.removeEventListener("beforeunload", handleBeforeUnload);
            setFetch(false);
            unsub();
        };
    }, [user]);

    useEffect(() => {
        const checkAuth = async () => {
            setLoading(true);
            try {
                const res = await api.get("/auth/me");
                setUser(res.data);

                if (pathname.startsWith("/auth")) {
                    router.push("/");
                }
            } catch {
                setUser(null);

                const protectedPaths = ["/", "/game"];
                if (protectedPaths.includes(pathname)) {
                    router.push("/auth");
                }
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [pathname, router, setUser, setLoading]);

    return (
        <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
            <header className="w-full py-1 px-2 flex justify-between items-center border-b h-12">
                <Link href="/">
                    <h1 className="font-bold flex gap-1 text-nowrap items-center">
                        <Image src="/favicon/android-chrome-192x192.png" alt="x/o" height={300} width={300} className="h-8 w-8 rounded-2xl border" /> xo arena
                    </h1>
                </Link>
                <div className="flex gap-1 items-center">
                    <ProfileDropdown />
                    <ThemeToggle />
                </div>
            </header>
            {children}
            <Toaster richColors />
        </ThemeProvider>
    );
}
