import {Composer} from 'telegraf';
import {MyContext} from '../types/context.type';
import { log } from '../utils';

const triggerComposer = new Composer<MyContext>();

triggerComposer.command('trigger', (ctx, next) => {
  const chat = ctx.session.chat;
  const trigger = ctx.message.text.split(' ')[1].toLowerCase().trim();

  if (chat == null || trigger == null) return;

  if (chat.triggers?.some((value) => value === trigger)) {
    chat.triggers?.push(trigger);
    chat.save();
  }

  log(chat.triggers?.join(' ') || "");
  log(trigger);

  next();
});

export default triggerComposer;
