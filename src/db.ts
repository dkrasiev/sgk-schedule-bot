import { ISession } from "@grammyjs/storage-mongodb";
import { MongoClient } from "mongodb";
import { isProduction } from "./constants";

const mongodbUri = process.env.MONGODB_URI;
const dbName = isProduction
  ? process.env.DATABASE_NAME
  : process.env.DATABASE_NAME_TEST;

if (!mongodbUri) {
  throw new Error("MONGODB_URI required");
}

const client = new MongoClient(mongodbUri);
client.connect();

export const db = client.db(dbName);
export const chatsCollection = db.collection<ISession>("chats");
