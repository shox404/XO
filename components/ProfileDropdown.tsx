"use client";

import { useAuthStore } from "@/store/auth.store";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import MiniProfile from "./MiniProfile";
import { useRouter } from "next/navigation";

export default function ProfileDropdown() {
    const { user, logout } = useAuthStore();
    const router = useRouter();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full">
                    <MiniProfile user={user} small />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-40 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-700">
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                    Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => logout()}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
