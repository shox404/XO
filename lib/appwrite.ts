import { Client, Databases, Storage } from "node-appwrite";

const client = new Client();

client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
    .setKey(process.env.NEXT_PUBLIC_APPWRITE_API_KEY!);

export const databases = new Databases(client);
export const storage = new Storage(client);

export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DB!;
export const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET!;
export const USERS_COLLECTION = "users";
export const OTP_COLLECTION = "otp_codes";
export const ROOMS_COLLECTION = "rooms";
export const MSGS_COLLECTION = "messages";
export const PRESENCE_COLLECTION = "presence";

export const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET!;
