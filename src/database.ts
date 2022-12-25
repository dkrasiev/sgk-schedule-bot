import { ISession } from "@grammyjs/storage-mongodb";
import { MongoClient } from "mongodb";
import { config } from "./config";
import { Group } from "./models/group.interface";
import { ScheduleCollection } from "./models/schedule-collection.interface";

const uri: string = config.database.uri;
const name: string = config.database.name;

if (!uri) {
  throw new Error("DB_URI required");
}
if (!name) {
  throw new Error("DB_NAME required");
}

export const connection = new MongoClient(uri);
export const database = connection.db(name);

export const sessions = database.collection<ISession>("chats");
export const schedules = database.collection<ScheduleCollection>("schedule");
export const groups = database.collection<Group>("groups");
