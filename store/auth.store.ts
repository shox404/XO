import { create } from "zustand";
import { toast } from "sonner";
import { User } from "@/lib/types";
import { api } from "@/lib/api";
import { dealer } from "@/lib/balance";

interface AuthState {
    user: User | null;
    loading: boolean;
    sentEmail: string;
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
    checkAuth: () => Promise<void>;
    updateBalance: (addup: number) => Promise<void>;
    partialUpdateUser: ($id: string, data: Record<string, string | number | boolean | null>) => void;
    requestCode: (email: string) => Promise<void>;
    verifyCode: (email: string, code: string) => Promise<void>;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    loading: false,
    sentEmail: "",

    setUser: (user: User | null) => set({ user }),
    setLoading: (loading: boolean) => set({ loading }),

    partialUpdateUser: async (id, data) => {
        const res = await api.patch("/user", { id, ...data })
        set({ user: res.data })
    },

    updateBalance: async (wonOrLost) => {
        const user = get().user;
        if (!user) {
            toast.error("User not logged in.");
            return;
        }
        try {
            let newBalance: [number, number];
            if (
                Array.isArray(user.balance) &&
                user.balance.length === 2 &&
                typeof user.balance[0] === "number" &&
                typeof user.balance[1] === "number"
            ) {
                newBalance = [user.balance[0], user.balance[1]];
            } else {
                newBalance = [0, 0];
            }

            if (wonOrLost > 0) {
                newBalance[0] += wonOrLost;
            } else if (user?.balance[0] > user?.balance[1]) {
                newBalance[1] += Math.abs(wonOrLost);
            }

            await api.post("/user/balance", { balance: newBalance });
            set({ user: { ...user, balance: newBalance } });
        } catch (err: any) {
            toast.error(err.response?.data?.error || "Failed to update balance");
        }
    },

    checkAuth: async () => {
        get().setLoading(true);
        try {
            const res = await api.get("/auth/me");
            get().setUser(res.data);
        } catch {
            get().setUser(null);
        } finally {
            get().setLoading(false);
        }
    },

    requestCode: async (email: string) => {
        if (email === get().sentEmail) {
            toast.info("Check your email for the code.");
            return;
        }
        get().setLoading(true);
        try {
            await api.post("/auth/request-code", { email });
            toast.success("Code sent! Check your email.");
            set({ sentEmail: email });
        } catch (err: any) {
            toast.error(err.response?.data?.error || "Failed to send code");
        } finally {
            get().setLoading(false);
        }
    },

    verifyCode: async (email: string, code: string) => {
        get().setLoading(true);
        try {
            const res = await api.post("/auth/verify-code", { email, code });
            toast.success("Logged in successfully!");
            get().setUser(res.data);
        } catch (err: any) {
            toast.error(err.response?.data?.error || "Invalid code");
            throw err;
        } finally {
            get().setLoading(false);
        }
    },

    logout: async () => {
        get().setUser(null);
        set({ sentEmail: "" });
        try {
            await api.post("/auth/logout");
        } finally {
            toast.success("Logged out");
        }
    },
}));
