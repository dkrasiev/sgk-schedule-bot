import {Composer} from 'telegraf';
import {MyContext} from '../types/context.type';
import {sendSchedule} from '../utils';

const scheduleComposer = new Composer<MyContext>();

scheduleComposer.command('schedule', async (ctx) => {
  const result = await sendSchedule(ctx);

  if (result === false) {
    await ctx.reply(ctx.i18n.t('group_not_found'));
  }
});

scheduleComposer.on('text', async (ctx) => {
  if (
    (ctx.chat.type === 'private' && ctx.session?.messageHasGroup) ||
    ctx.message.text.includes('расписание')
  ) {
    const result = await sendSchedule(ctx);

    if (result === false) {
      await ctx.reply(ctx.i18n.t('group_not_found'));
    }
  }
});

export {scheduleComposer};
