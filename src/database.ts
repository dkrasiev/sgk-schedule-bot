import { ISession } from "@grammyjs/storage-mongodb";
import mongoose from "mongoose";

import { ScheduleCollection } from "./models/schedule-collection.interface";
import { DB_NAME, DB_URI } from "./config";

export const connection = mongoose.createConnection(DB_URI, {
  dbName: DB_NAME,
});

export const sessions = connection.collection<ISession>("sessions");
export const schedules = connection.collection<ScheduleCollection>("schedules");
