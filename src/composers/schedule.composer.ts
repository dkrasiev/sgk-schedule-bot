import dayjs from 'dayjs';
import {Composer} from 'telegraf';
import {MyContext} from '../types/context.type';
import {fetchSchedule, getNextWorkDate, getScheduleMessage} from '../utils';

const scheduleComposer = new Composer<MyContext>();

scheduleComposer.command('schedule', async (ctx) => {
  await sendSchedule(ctx);
});

scheduleComposer.command('today', async (ctx) => {
  await sendShortSchedule(ctx, dayjs());
});

scheduleComposer.command('tomorrow', async (ctx) => {
  await sendShortSchedule(ctx, dayjs().add(1, 'day'));
});

/**
 * Отправляет расписание на указанные день
 * @param {Context<MyContext>} ctx Context
 * @param {dayj.Dayjs} date  Date
 */
async function sendShortSchedule(ctx: MyContext, date: dayjs.Dayjs) {
  const group = ctx.state.group;

  if (!group) {
    await ctx.reply(ctx.i18n.t('group_not_found'));
    return;
  }

  const schedule = await fetchSchedule(group, date);

  await ctx.reply(getScheduleMessage(schedule, group));
}

/**
 * Отправляет расписание на два дня
 * @param {Context} ctx контекст
 * @param {Dayjs} date дата (по умолчанию сегодня)
 */
export async function sendSchedule(ctx: MyContext, date = dayjs()) {
  const group = ctx.state.group;
  if (!group) {
    ctx.reply(ctx.i18n.t('group_not_found'));
    return;
  }

  const firstDate = getNextWorkDate(date);
  const secondDate = getNextWorkDate(firstDate.add(1, 'day'));

  const firstSchedule = await fetchSchedule(group, firstDate);
  const secondSchedule = await fetchSchedule(group, secondDate);

  await ctx.reply(getScheduleMessage(firstSchedule, group));
  await ctx.reply(getScheduleMessage(secondSchedule, group));
}

export {scheduleComposer};
