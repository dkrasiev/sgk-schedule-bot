const {Composer} = require('telegraf');
const {sendSchedule} = require('../utils');
const composer = new Composer();

composer.command('schedule', async (ctx) => {
  const result = await sendSchedule(ctx);

  if (result === false) {
    await ctx.reply('Группа не найдена или Вы ничего не ввели');
  }
});

composer.on('text', async (ctx) => {
  if (
    (ctx.chat.type === 'private' && ctx.message.hasGroup) ||
    ctx.message.text.includes('расписание')
  ) {
    const result = await sendSchedule(ctx);

    if (result === false) {
      await ctx.reply('Группа не найдена или Вы ничего не ввели');
    }
  }
});

module.exports = composer;
