import { ISession } from '@grammyjs/storage-mongodb'
import mongoose from 'mongoose'

// import { ScheduleCollection } from "../models/schedule-collection.interface";
import { MONGODB_NAME, MONGODB_URI } from './config'

export const connection = mongoose.createConnection(MONGODB_URI, {
  dbName: MONGODB_NAME,
})

export const sessions = connection.collection<ISession>('sessions')
// export const schedules = connection.collection<ScheduleCollection>("schedules");
