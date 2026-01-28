import axios from "axios";
import { create } from "zustand";

type StorageState = {
    file: File | null;
    fileId: string | null;
    preview: string | null;
    loading: boolean;
    setFile: (file: File | null) => void;
    setPreview: (url: string | null) => void;
    upload: () => Promise<void>;
    send: (cb: (fileId: string) => void) => void;
    reset: () => void;
};

export const useStorageStore = create<StorageState>((set, get) => ({
    file: null,
    fileId: null,
    preview: null,
    loading: false,

    setFile: (file) => set({ file }),
    setPreview: (preview) => set({ preview }),

    upload: async () => {
        const { file, preview } = get();
        if (!file) return;

        set({ loading: true });

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await axios.post("/api/storage/upload", formData);
            const id = res.data.$id;

            set({
                fileId: id,
                preview,
                loading: false,
            });
        } catch (err) {
            console.error("Upload failed:", err);
            set({ loading: false });
        }
    },

    send: (cb) => {
        const { fileId } = get();
        if (!fileId) return;
        cb(fileId);
    },

    reset: () => set({ file: null, fileId: null, preview: null, loading: false }),
}));
