import {Composer} from 'telegraf';
import {getGroupFromString} from '../utils';
import {chats, groups} from '../models';
import {MyContext} from '../types/context.type';

const groupComposer = new Composer<MyContext>();

groupComposer.on('text', async (ctx, next) => {
  ctx.session = {};

  const chat = await chats.findOne({id: ctx.chat.id});
  if (!chat) return;

  const groupFromMessage = await getGroupFromString(ctx.message.text);
  const groupFromChat = await groups.findOne({id: chat.defaultGroup});

  ctx.session.group = groupFromMessage || groupFromChat || undefined;
  ctx.session.messageHasGroup = !!groupFromMessage;

  next();
});

export {groupComposer};
