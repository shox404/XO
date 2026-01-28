import { Message } from "@/lib/types";
import { create } from "zustand";

interface ChatState {
  messages: Message[];
  setMessages: (fn: (msgs: Message[]) => Message[]) => void;
  addMessage: (msg: Message) => void;
  clearRoomMessages: (roomId: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],

  setMessages: (fn) => set((state) => ({ messages: fn(state.messages) })),

  addMessage: (msg) =>
    set((state) => {
      const exists = state.messages.some((m) => m.$id === msg.$id);
      if (exists) return state;

      return {
        messages: [...state.messages, msg].sort(
          (a, b) => new Date(a.$createdAt).getTime() - new Date(b.$createdAt).getTime()
        ),
      };
    }),

  clearRoomMessages: (roomId) =>
    set((state) => ({
      messages: state.messages.filter((m) => m.roomId !== roomId),
    })),
}));
