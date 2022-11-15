import {Composer} from 'telegraf';
import {MyContext} from '../types/context.type';
import {chats} from '../models';

const chatComposer = new Composer<MyContext>();

chatComposer.on('message', async (ctx, next) => {
  let chat = await chats.findOne({id: ctx.chat.id});
  if (chat == null) {
    chat = await chats.create({id: ctx.chat.id});
  }

  ctx.state.chat = chat;

  next();
});

export default chatComposer;
