import { ISession } from "@grammyjs/storage-mongodb";
import { MongoClient } from "mongodb";

const mongodbUri = process.env.MONGODB_URI;
const dbName = process.env.DATABASE_NAME;
if (!mongodbUri) {
  throw new Error("MONGODB_URI required");
}

const client = new MongoClient(mongodbUri);
client.connect();

export const db = client.db(dbName);
export const chatsCollection = db.collection<ISession>("chats");
