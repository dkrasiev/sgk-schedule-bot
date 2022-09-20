import {Composer} from 'telegraf';
import {MyContext} from '../types/context.type';
import {chats} from '../models';

const chatComposer = new Composer<MyContext>();

chatComposer.on('message', async (ctx, next) => {
  if (!(await chats.findOne({id: ctx.chat.id}))) {
    await chats.create({id: ctx.chat.id});
  }

  next();
});

export {chatComposer};
