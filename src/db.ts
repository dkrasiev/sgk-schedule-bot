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

export const mongoClient = new MongoClient(mongodbUri);
mongoClient.connect();

export const db = mongoClient.db(dbName);
export const chatsCollection = db.collection<ISession>("chats");
