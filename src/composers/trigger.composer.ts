import {Composer} from 'telegraf';
import {ChatDocument} from '../models/chat.model';
import {MyContext} from '../types/context.type';
import {sendSchedule} from './schedule.composer';

const triggerComposer = new Composer<MyContext>();

triggerComposer.command('trigger', async (ctx) => {
  const chat = ctx.state.chat as ChatDocument;
  const trigger = ctx.message.text.split(' ')[1]?.toLowerCase()?.trim();

  if (chat == null) return;

  const isTriggerNew = chat.triggers?.includes(trigger) === false;

  if (!trigger) {
    await ctx.replyWithMarkdownV2(ctx.i18n.t('trigger_not_found'));
  }

  if (isTriggerNew && trigger) {
    chat.triggers?.push(trigger);
    await chat.save();
    await ctx.reply(ctx.i18n.t('trigger_added', {trigger: trigger}));
  } else if (trigger) {
    chat.triggers =
      chat.triggers?.filter((value: string) => {
        return value !== trigger;
      }) || [];
    await chat.save();
    await ctx.reply(ctx.i18n.t('trigger_deleted', {trigger: trigger}));
  }

  await ctx.reply(
    chat.triggers?.length ?
      ctx.i18n.t('trigger_list', {triggers: chat.triggers.join('\n')}) :
      ctx.i18n.t('trigger_list_not_found'),
  );
});

triggerComposer.on('text', async (ctx, next) => {
  const chat = ctx.state.chat as ChatDocument;
  const triggered = chat.triggers?.some((trigger: string) => {
    return ctx.message.text.toLowerCase().split(/\s/m).includes(trigger);
  });

  if (chat && triggered) {
    await sendSchedule(ctx);
    return;
  }

  next();
});

export default triggerComposer;
