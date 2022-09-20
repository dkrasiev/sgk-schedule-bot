import {Composer} from 'telegraf';
import dayjs from 'dayjs';
import {chats, groups} from '../models';
import {
  getGroupFromString,
  fetchSchedule,
  getScheduleMessage,
} from '../utils';
import {MyContext} from '../types/context.type';

const mainComposer = new Composer<MyContext>();

mainComposer.command('groups', async (ctx) => {
  const groupsArray = await groups.find();

  const groupsNameArray = groupsArray
      .map((group) => group.name)
      .sort((a, b) => a.localeCompare(b));

  await ctx.reply(groupsNameArray.join('\n'));
});

mainComposer.command('setgroup', async (ctx) => {
  const chat = await chats.findOne({id: ctx.chat.id});
  const group = await getGroupFromString(ctx.message.text);

  if (group && chat) {
    chat.defaultGroup = group.id;
    await chat.save();
    await ctx.reply(ctx.i18n.t('set_group_success', {group}));
  } else {
    await ctx.reply(ctx.i18n.t('set_group_fail'));
  }
});

mainComposer.command('removedefault', async (ctx) => {
  const chat = await chats.findOne({id: ctx.chat.id});

  if (chat?.defaultGroup) {
    chat.defaultGroup = undefined;
    await chat.save();
    await ctx.reply(ctx.i18n.t('remove_group_success'));
    return;
  }

  await ctx.reply(ctx.i18n.t('remove_group_fail'));
});

mainComposer.command('today', async (ctx) => {
  const group = ctx.session?.group;

  if (!group) {
    return;
  }

  const schedule = await fetchSchedule(group, dayjs());

  await ctx.reply(getScheduleMessage(schedule, group));
});

mainComposer.command('tomorrow', async (ctx) => {
  const group = ctx.session?.group;

  if (!group) {
    return;
  }

  const schedule = await fetchSchedule(group, dayjs().add(1, 'day'));

  await ctx.reply(getScheduleMessage(schedule, group));
});

export {mainComposer};
