import { Client } from "appwrite";
import { GameState } from "@/store/game.store";
import { DATABASE_ID, MSGS_COLLECTION, PRESENCE_COLLECTION, ROOMS_COLLECTION } from "./appwrite";
import { Room } from "./types";
import { useChatStore } from "@/store/chat.store";
import { api } from "./api";
import { useUsersStore } from "@/store/leader.store";
import { usePresenceStore } from "@/store/presence.store";
import { awardSystem } from "@/app/game/page";
import { useAuthStore } from "@/store/auth.store";

export const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

const isRoom = (p: any): p is Room =>
    p && typeof p === "object" && typeof p.$id === "string" && typeof p.board === "string" && typeof p.turn === "string";

let unsubRoom: (() => void) | null = null;
let unsubChat: (() => void) | null = null;

export const subscribeRoom = (game: GameState) => {
    unsubRoom?.();
    const chat = useChatStore.getState();
    const user = useUsersStore.getState();

    unsubRoom = client.subscribe(
        `databases.${DATABASE_ID}.collections.${ROOMS_COLLECTION}.documents.${game.room?.$id}`,
        (e) => {
            if (e.events.some(ev => ev.endsWith(".delete"))) {
                api.delete(`/chat?roomId=${game.room?.$id}`);
                chat.clearRoomMessages(game.room?.$id!);
                game.setRoom(null);
                user.clearPlayer()
                return;
            }
            if (isRoom(e.payload)) game.setRoom(e.payload);
            if (game.room?.status === "finished") awardSystem();
        }
    );

    return () => unsubRoom;
};

export const subscribeChat = (roomId: string) => {
    unsubChat?.();
    const chat = useChatStore.getState();

    unsubChat = client.subscribe(
        `databases.${DATABASE_ID}.collections.${MSGS_COLLECTION}.documents`,
        (e) => {
            const msg = e.payload as any;
            if (!msg || msg.roomId !== roomId) return;

            chat.addMessage({
                $id: msg.$id,
                roomId: msg.roomId,
                userId: msg.userId,
                msg: msg.msg,
                $createdAt: msg.$createdAt,
            });
        }
    );

    return () => unsubChat;
};

let unsubPresence: (() => void) | null = null;

export const subscribePresence = () => {
    if (unsubPresence) unsubPresence();

    const presenceStore = usePresenceStore.getState();

    unsubPresence = client.subscribe(
        `databases.${DATABASE_ID}.collections.${PRESENCE_COLLECTION}.documents`,
        (e) => {
            const presence = e.payload as {
                userId: string;
                action: "on" | "type" | "play" | "off";
            };

            if (!presence?.userId) return;

            presenceStore.setPresence(presence.userId, presence.action);
        }
    );

    return () => {
        unsubPresence?.();
        unsubPresence = null;
    };
};

