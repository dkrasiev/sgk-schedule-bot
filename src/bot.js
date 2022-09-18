const {Telegraf} = require('telegraf');

const bot = new Telegraf(
    process.env.BOT_TOKEN,
);

const botCommands = [
  {command: 'schedule', description: 'Скинуть расписание'},
  {command: 'groups', description: 'Показать все группы'},
  {command: 'setgroup', description: 'Выбрать группу по умолчанию'},
  {command: 'subscribe', description: 'Подписаться на обновления расписания'},
  {
    command: 'unsubscribe',
    description: 'Отписаться от обновлений расписания',
  },
];

bot.telegram.setMyCommands(botCommands);

module.exports = bot;
