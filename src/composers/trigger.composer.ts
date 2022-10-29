import {Composer} from 'telegraf';
import {ChatDocument} from '../models/chat.model';
import {MyContext} from '../types/context.type';
import {sendSchedule} from './schedule.composer';

const triggerComposer = new Composer<MyContext>();

triggerComposer.command('trigger', async (ctx) => {
  const chat = ctx.state.chat as ChatDocument;
  const triggerFromMessage = ctx.message.text
      .split(' ')[1]
      ?.toLowerCase()
      ?.trim();

  if (chat == null) return;

  const isTriggerNew = chat.triggers?.includes(triggerFromMessage) === false;

  if (triggerFromMessage && isTriggerNew) {
    chat.triggers?.push(triggerFromMessage);
    await chat.save();
    await ctx.reply(ctx.i18n.t('trigger_added', {trigger: triggerFromMessage}));
  } else if (triggerFromMessage) {
    chat.triggers =
      chat.triggers?.filter((trigger: string) => {
        return trigger !== triggerFromMessage;
      }) || [];
    await chat.save();
    await ctx.reply(ctx.i18n.t(
        'trigger_deleted', {trigger: triggerFromMessage}));
  }

  await ctx.reply(
    chat.triggers?.length ?
    ctx.i18n.t('trigger_list', {triggers: chat.triggers.join('\n')}) :
    ctx.i18n.t('trigger_list_not_found'));
});

triggerComposer.on('text', async (ctx, next) => {
  const chat = ctx.state.chat as ChatDocument;
  const include = chat.triggers?.some((trigger: string) => {
    return ctx.message.text.split(/\s/m).includes(trigger);
  });

  if (chat && include) {
    await sendSchedule(ctx);
    return;
  }

  next();
});

export default triggerComposer;
