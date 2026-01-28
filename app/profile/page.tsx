"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useStorageStore } from "@/store/storage.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import AvatarUploader from "@/components/AvatarUploader";

export default function ProfilePage() {
    const { user, partialUpdateUser } = useAuthStore();
    const { preview, upload, send, reset, loading } = useStorageStore();
    const [name, setName] = useState("");
    const [dirty, setDirty] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (name === "" || name === undefined) {
            setName(user?.name as string)
        }
    }, [user]);

    useEffect(() => {
        if (name === user?.name) setDirty(false);
    }, [name])

    useEffect(() => {
        return () => {
            if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const saveProfile = async () => {
        if (!user) return;

        if (name !== user.name) {
            partialUpdateUser(user.$id, { name });
        }

        if (preview) {
            await upload();
            send((fileId: string) => {
                partialUpdateUser(user.$id, { avatar: fileId });
                reset();
            });
        }

        setDirty(false);
    };

    return (
        <div className="min-h-[calc(100dvh-49px)] flex items-center justify-center px-4">
            <div className="w-full max-w-md rounded-3xl border bg-background p-8 shadow-sm">
                <Button onClick={() => router.back()} className="cursor-pointer">
                    <ArrowLeft /> Back
                </Button>
                <div className="flex flex-col items-center gap-3 mb-8">
                    <AvatarUploader />
                </div>

                <div className="space-y-5">
                    <CuteField label="Name">
                        <Input
                            value={name}
                            className="rounded-xl"
                            onChange={(e) => {
                                setName(e.target.value);
                                setDirty(true);
                            }}
                        />
                    </CuteField>
                    <CuteField label="Email">
                        <Input value={user?.email || ""} disabled className="rounded-xl" />
                    </CuteField>
                </div>
                <Button onClick={saveProfile} disabled={!dirty || loading} className="w-full mt-8 rounded-xl h-11 gap-2">
                    <Save className="h-4 w-4" />
                    Save changes
                </Button>
            </div>
        </div>
    );
}

function CuteField({ label, children }: {
    label: string; children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
                {label}
            </label>
            {children}
        </div>
    );
};