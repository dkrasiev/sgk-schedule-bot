import { ISession } from "@grammyjs/storage-mongodb";
import { MongoClient } from "mongodb";

import { ScheduleCollection } from "./models/schedule-collection.interface";
import { DB_NAME, DB_MONGO_URI } from "./config";

export const mongoClient = new MongoClient(DB_MONGO_URI, {
  directConnection: true,
});
export const database = mongoClient.db(DB_NAME);

export const sessions = database.collection<ISession>("sessions");
export const schedules = database.collection<ScheduleCollection>("schedule");
