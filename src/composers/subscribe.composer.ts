import {Composer} from 'telegraf';
import dayjs from 'dayjs';
import {chats, groups} from '../models';
import {
  getNextWorkDate,
  fetchSchedule,
  removeSubscription,
} from '../utils';
import {MyContext} from '../types/context.type';

const subscribeComposer = new Composer<MyContext>();

subscribeComposer.command('subscribe', async (ctx) => {
  if (!ctx.chat) return;

  const chat = await chats.findOne({id: ctx.chat.id});
  const group = ctx.session?.group;

  if (group && chat) {
    const firstDate = getNextWorkDate(dayjs());
    const secondDate = getNextWorkDate(firstDate);

    const schedule = await fetchSchedule(group, secondDate);

    chat.subscription = {
      groupId: group.id,
      lastSchedule: schedule,
    };
    await chat.save();

    await ctx.reply(ctx.i18n.t('subscribe_success', {group}));
  } else {
    await ctx.reply(ctx.i18n.t('subscribe_fail'));
  }
});

subscribeComposer.command('unsubscribe', async (ctx) => {
  const chat = await chats.findOne({id: ctx.chat.id});
  if (!chat) return;

  const group = await groups.findOne({id: chat.subscription?.groupId});

  if (await removeSubscription(chat)) {
    await ctx.reply(ctx.i18n.t('unsubscribe_success', {group}));
  } else {
    await ctx.reply(ctx.i18n.t('unsubscribe_fail'));
  }
});

export {subscribeComposer};
