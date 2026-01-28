import { User } from "@/lib/types";
import { create } from "zustand";
import { api } from "@/lib/api";

type UsersStore = {
    leaders: User[];
    player: User | null,

    getPlayer: ($id: string) => void;
    clearPlayer: () => void;
    getLeaders: () => void;
};

export const useUsersStore = create<UsersStore>((set, get) => ({
    leaders: [],
    player: null,

    getPlayer: async ($id) => {
        if ($id == "") return;
        const user = get().leaders.filter(e => e.$id === $id)[0];
        if (user) {
            set({ player: user })
        } else {
            const res = await api.get(`/user?$id=${$id}`)
            set({ player: res.data })
        }
    },
    clearPlayer: () => set({ player: null }),
    getLeaders: () => {
        api.get("/leaderboard").then((res) => {
            set({ leaders: res.data })
        })
    },
}));
