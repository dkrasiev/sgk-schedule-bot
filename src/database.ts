import { ISession } from "@grammyjs/storage-mongodb";
import { MongoClient } from "mongodb";

import { config } from "./config";
import { Cabinet } from "./models/cabinet.interface";
import { Group } from "./models/group.interface";
import { ScheduleCollection } from "./models/schedule-collection.interface";
import { Teacher } from "./models/teacher.interface";

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

export const sessions = database.collection<ISession>("sessions");
export const schedules = database.collection<ScheduleCollection>("schedule");
export const groups = database.collection<Group>("groups");
export const teachers = database.collection<Teacher>("teachers");
export const cabinets = database.collection<Cabinet>("cabinets");
