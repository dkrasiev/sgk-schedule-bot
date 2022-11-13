import mongoose from 'mongoose';
import {log} from './utils';

/**
 * Connecting to mongoDB
 */
export async function connect() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI required');
  }

  await mongoose.connect(process.env.MONGODB_URI);
  log('mongoose connected');
}
