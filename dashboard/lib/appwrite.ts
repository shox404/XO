import { Client, Databases, Storage } from "node-appwrite";

const client = new Client();

client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(process.env.NEXT_PUBLIC_APPWRITE_API_KEY!);

export const databases = new Databases(client);
export const storage = new Storage(client);

export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
export const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!;
export const DEVS_COLLECTION = "devs";
export const USERS_COLLECTION = "users";
export const PROJECTS_COLLECTION = "projects";
export const OTP_COLLECTION = "otps";

export const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET!;
