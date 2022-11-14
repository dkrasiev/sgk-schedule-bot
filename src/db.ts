import mongoose from 'mongoose';

/**
 * Connecting to mongoDB
 */
export async function connect() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI required');
  }

  await mongoose.connect(process.env.MONGODB_URI);
}
