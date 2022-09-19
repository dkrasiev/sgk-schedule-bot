const {Telegraf} = require('telegraf');

const isProduction = process.env.NODE_ENV === 'production';
const token = isProduction ? process.env.BOT_TOKEN : process.env.BOT_TOKEN_TEST;
const bot = new Telegraf(token);

if (!isProduction) bot.launch();

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

bot.on('text', require('./middlewares/log.middleware'));

bot.on('message', require('./middlewares/chat.middleware'));
bot.on('text', require('./middlewares/group.middleware'));

bot.use(require('./composers/start.composer'));
bot.use(require('./composers/main.composer'));
bot.use(require('./composers/subscribe.composer'));
bot.use(require('./composers/schedule.composer'));

module.exports = bot;
