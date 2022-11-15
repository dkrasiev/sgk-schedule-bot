import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import cron from 'node-cron';

import {createBot} from './bot';
import {log, update} from './utils';
import {MyContext} from './types/context.type';

/**
 * start bot
 */
async function run() {
  const isProduction = process.env.NODE_ENV === 'production';
  const token = isProduction ?
    process.env.BOT_TOKEN :
    process.env.BOT_TOKEN_TEST;
  if (!token) {
    throw new Error('Bot token is required');
  }
  const bot = createBot<MyContext>(token);
  await bot.launch();
  log('Bot has been launched');

  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI required');
  }
  await mongoose.connect(MONGODB_URI);
  log('Mongoose has been connected');

  cron.schedule('*/15 * * * *', () => {
    update<MyContext>(bot);
  });
}

run();
