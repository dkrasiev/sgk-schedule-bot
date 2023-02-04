import { ISession } from "@grammyjs/storage-mongodb";
import { MongoClient } from "mongodb";

import { config } from "./config";
import { Cabinet } from "./models/cabinet.interface";
import { Group } from "./models/group.interface";
import { ScheduleCollection } from "./models/schedule-collection.interface";
import { Teacher } from "./models/teacher.interface";

export const mongoClient = new MongoClient(config.database.uri, {
  directConnection: true,
});
export const database = mongoClient.db(config.database.name);

export const sessions = database.collection<ISession>("sessions");
export const schedules = database.collection<ScheduleCollection>("schedule");
export const groups = database.collection<Group>("groups");
export const teachers = database.collection<Teacher>("teachers");
export const cabinets = database.collection<Cabinet>("cabinets");
