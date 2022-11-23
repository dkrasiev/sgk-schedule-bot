import { ISession } from "@grammyjs/storage-mongodb";
import { MongoClient } from "mongodb";
import { config } from "./config";
import { Group } from "./interfaces";
import { ScheduleCollection } from "./interfaces/schedule-collection.interface";

const mongodbUri = process.env.MONGODB_URI;
export const databaseName = config.isProduction
  ? process.env.DATABASE_NAME
  : process.env.DATABASE_NAME_TEST;

if (!mongodbUri) {
  throw new Error("MONGODB_URI required");
}
if (!databaseName) {
  throw new Error("Database name required");
}

export const connection = new MongoClient(mongodbUri);
export const database = connection.db(databaseName);

export const chatsCollection = database.collection<ISession>("chats");

export const scheduleCollection =
  database.collection<ScheduleCollection>("schedule");
export const groupsCollection = database.collection<Group>("groups");
