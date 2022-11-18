import { ISession } from "@grammyjs/storage-mongodb";
import { MongoClient } from "mongodb";
import { isProduction } from "./constants";
import { ScheduleCollection } from "./models/schedule-collection.interface";

const mongodbUri = process.env.MONGODB_URI;
const databaseName = isProduction
  ? process.env.DATABASE_NAME
  : process.env.DATABASE_NAME_TEST;

if (!mongodbUri) {
  throw new Error("MONGODB_URI required");
}

export const connection = new MongoClient(mongodbUri);
export const database = connection.db(databaseName);
export const chatsCollection = database.collection<ISession>("chats");
export const scheduleCollection =
  database.collection<ScheduleCollection>("schedule");
