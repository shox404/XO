import { api } from "@/lib/api";
import { User } from "@/lib/types";
import { create } from "zustand";

interface UsersState {
    users: User[];
    loading: boolean;
    error: string | null;
    getUsers: () => Promise<void>;
}

export const useUsersStore = create<UsersState>((set) => ({
    users: [],
    loading: false,
    error: null,

    getUsers: async () => {
        try {
            set({ loading: true, error: null });

            const res = await api.get("/user/all");

            set({ users: res.data, loading: false });
        } catch (err: any) {
            set({
                error: err.message || "Something went wrong",
                loading: false,
            });
        }
    },
}));