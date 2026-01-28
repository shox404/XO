"use client";

import { useRef, useEffect, useState } from "react";
import { useStorageStore } from "@/store/storage.store";
import { Camera, Save } from "lucide-react";
import { Button } from "./ui/button";
import { useAuthStore } from "@/store/auth.store";
import Image from "next/image";

export default function AvatarUploader() {
    const { setFile, preview, setPreview, upload, send, reset, loading } =
        useStorageStore();

    const { user, partialUpdateUser } = useAuthStore();

    const inputRef = useRef<HTMLInputElement>(null);
    const [hasChanges, setHasChanges] = useState(false);

    const handleClick = () => inputRef.current?.click();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFile(file);

        const localPreview = URL.createObjectURL(file);
        setPreview(localPreview);

        setHasChanges(true);
    };

    const handleSave = async () => {
        if (!hasChanges || !user) return;

        await upload();

        send((fileId: string) => {
            partialUpdateUser(user.$id, { avatar: fileId });
            reset();
            setHasChanges(false);
        });
    };

    useEffect(() => {
        return () => {
            if (preview?.startsWith("blob:")) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    return (
        <div className="flex flex-col items-center gap-3">
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />

            <Button
                onClick={handleClick}
                variant="ghost"
                className="relative h-30 w-30 rounded-full p-0 overflow-hidden group border-2"
            >
                {preview ? (
                    <Image
                        height={500}
                        width={500}
                        src={preview}
                        alt="*"
                        className="h-full w-full object-cover"
                    />
                ) : (
                    user?.avatar ? <Image
                        height={500}
                        width={500}
                        src={`/api/storage/preview/${user?.avatar}`}
                        alt="*"
                        className="h-full w-full object-cover"
                    /> : <div className="flex h-full w-full items-center justify-center bg-neutral-200 dark:bg-neutral-800">
                        <Camera className="h-6 w-6 text-neutral-500" />
                    </div>
                )}

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                    <Camera className="h-5 w-5 text-white" />
                </div>
            </Button>

            <Button
                onClick={handleSave}
                disabled={!hasChanges || loading}
                className="gap-2"
            >
                <Save className="h-4 w-4" />
                Save
            </Button>
        </div>
    );
}
