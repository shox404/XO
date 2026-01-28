"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle } from "lucide-react";

import { useAuthStore } from "@/store/auth.store";
import { useChatStore } from "@/store/chat.store";
import { useGameStore } from "@/store/game.store";
import { useGame } from "@/hooks/useGame";

import { api } from "@/lib/api";
import { subscribeChat } from "@/lib/realtime";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Chat() {
  const { user } = useAuthStore();
  const { room } = useGameStore();
  const { messages, addMessage, setMessages } = useChatStore();
  const { opponentId } = useGame();

  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!room?.$id) return;
    const unsub = subscribeChat(room.$id);
    return () => { unsub(); }
  }, [room?.$id]);

  useEffect(() => {
    if (!room?.$id) return;

    api
      .get(`/chat?roomId=${room.$id}`)
      .then(res => setMessages(() => res.data))
      .catch(() => console.error("Failed to fetch messages"));
  }, [room?.$id, setMessages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    const res = await api.post("/chat", {
      roomId: room?.$id,
      userId: user?.$id,
      msg: text.trim(),
    });

    addMessage(res.data);
    setText("");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          disabled={!opponentId}
          className="p-2 w-fit rounded-full"
        >
          Chat here <MessageCircle className="w-5 h-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="p-0 w-full md:w-[360px]">
        <SheetHeader className="px-4 py-3 border-b">
          <SheetTitle className="text-sm font-medium">Room Chat</SheetTitle>
        </SheetHeader>

        <div
          ref={scrollRef}
          className="h-[calc(100vh-140px)] overflow-y-auto px-4 py-3 space-y-2"
        >
          {messages.map(m => (
            <div
              key={m.$id}
              className={`max-w-[75%] text-sm px-3 py-2 rounded-lg ${m.userId === user?.$id
                ? "ml-auto bg-primary text-primary-foreground"
                : "bg-muted"
                }`}
            >
              {m.msg}
            </div>
          ))}
        </div>

        <div className="border-t p-3 flex gap-2">
          <Input
            value={text}
            placeholder="Type a message…"
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
          />
          <Button onClick={sendMessage}>Send</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
