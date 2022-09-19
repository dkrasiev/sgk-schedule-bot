const {Composer} = require('telegraf');
const composer = new Composer();

composer.start(async (ctx) => {
  const name = ctx.from.last_name ?
    `${ctx.from.first_name} ${ctx.from.last_name}` :
    ctx.from.first_name;

  let startMessage = `Привет, ${name}!\n`;
  startMessage += 'Чтобы узнать как я работаю, напиши /help';

  await ctx.reply(startMessage);
});

composer.help(async (ctx) => {
  const helpMessage = 'Для получения расписания введи команду /schedule';
  await ctx.reply(helpMessage);
});

module.exports = composer;
