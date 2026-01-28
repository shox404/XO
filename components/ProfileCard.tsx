"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/auth.store";
import { StarToken } from "./StarToken";
import { dealer } from "@/lib/balance";

export default function ProfileCard() {
    const { user } = useAuthStore();

    return (
        <div className="max-w-xs mx-auto rounded-xl flex flex-col items-center gap-2">
            <Avatar className="h-28 w-28 border">
                {user?.avatar && <AvatarImage src={`/api/storage/preview/${user?.avatar}`} />}
                <AvatarFallback className="text-4xl">{user?.name?.[0]}</AvatarFallback>
            </Avatar>

            <span className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 text-center">
                {user?.name}
            </span>
            <span className="text-lg font-bold text-center flex">
                <StarToken />{dealer(user?.balance as [number, number])}
            </span>
        </div>
    );
}
