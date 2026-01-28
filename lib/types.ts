export type User = {
    $id: string;
    name: string;
    balance: [number, number];
    email: string;
    avatar: string | null;
    $createdAt: Date;
}

export type Symbol = "X" | "O";

export interface Room {
    $id: string;
    board: string;
    turn: Symbol;
    winner?: Symbol | null | "draw";
    playerX?: string;
    playerO?: string;
    status: string;
    awarded: string[]
}

export interface Message {
    $id: string;
    roomId: string;
    userId: string;
    msg: string;
    $createdAt: string;
}

export type PresenceAction = "on" | "type" | "play" | "off";

export type Presence = {
    $id?: string;
    userId: string;
    action: PresenceAction
} 