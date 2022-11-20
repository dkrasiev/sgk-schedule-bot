import { ISession } from "@grammyjs/storage-mongodb";
import { MongoClient } from "mongodb";
import { isProduction } from "./constants";
import { Group } from "./interfaces";
import { ScheduleCollection } from "./interfaces/schedule-collection.interface";
import logger from "./utils/logger";

const mongodbUri = process.env.MONGODB_URI;
const databaseName = isProduction
  ? process.env.DATABASE_NAME
  : process.env.DATABASE_NAME_TEST;

if (!mongodbUri) {
  throw new Error("MONGODB_URI required");
}
if (!databaseName) {
  throw new Error("Database name required");
}

export const connection = new MongoClient(mongodbUri);
connection.connect().then(() => {
  logger.info("MongoDB connected");
  logger.info(`Database name: ${databaseName}`);
});

export const database = connection.db(databaseName);

export const chatsCollection = database.collection<ISession>("chats");

export const scheduleCollection =
  database.collection<ScheduleCollection>("schedule");
export const groupsCollection = database.collection<Group>("groups");
