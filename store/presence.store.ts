import { create } from "zustand";
import { api } from "@/lib/api";
import { Presence } from "@/lib/types";


interface PresenceState {
    presence: Presence[];
    fetched: boolean,
    setFetch: (value: boolean) => void,
    setPresence: (userId: string, action: Presence["action"]) => Promise<void>;
    updateAction: (userId: string, action: Presence["action"]) => Promise<void>;
    getOnlineUsers: () => Promise<void>;
}

export const usePresenceStore = create<PresenceState>((set, get) => ({
    presence: [],
    fetched: false,
    setFetch: (value) => set({ fetched: value }),
    setPresence: async (userId, action) => {
        try {
            set(() => {
                const index = get().presence.findIndex((u) => u.userId === userId);
                if (index >= 0) {
                    const newPresence = [...get().presence];
                    newPresence[index] = { userId, action };
                    return { presence: newPresence };
                } else {
                    return { presence: [...get().presence, { userId, action }] };
                }
            });
        } catch (err) {
            console.error("Failed to update presence:", err);
        }
    },

    updateAction: async (userId, action) => {
        try {
            set({ fetched: true })
            await api.post("/presence", { userId, action });
        } catch (err) {
            console.error("Failed to update presence:", err);
        }
    },

    getOnlineUsers: async () => {
        try {
            const res = await api.get("/presence")
            if (res.data) {
                set({ fetched: true })
            }
            set({ presence: res.data.onlineUsers });
        } catch (err) {
            console.error("Failed to fetch online users:", err);
        }
    },
}));
