"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/lib/types";

export default function MiniProfile({ user, right, small }: { user: User | null, right?: boolean, small?: boolean }) {
    const size = small ? 7 : 10;

    return (
        user && <div className={`w-fit flex gap-2 items-center border p-1 ${right ? "pl-2" : "pr-2"} rounded-3xl ${right && "flex-row-reverse"}`}>
            <Avatar className={`w-${size} h-${size}`}>
                {user?.avatar && <AvatarImage src={`/api/storage/preview/${user.avatar}`} alt={user?.name} />}
                <AvatarFallback>
                    {user?.name.charAt(0).toUpperCase()}
                </AvatarFallback>
            </Avatar>

            <div className="flex flex-col items-start">
                <h2 className="text-md font-semibold leading-none">
                    {user?.name}
                </h2>
            </div>
        </div>
    );
}
