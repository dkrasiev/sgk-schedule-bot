const {Telegraf} = require('telegraf');
const TelegrafI18n = require('telegraf-i18n');
const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';
const token = isProduction ? process.env.BOT_TOKEN : process.env.BOT_TOKEN_TEST;
const bot = new Telegraf(token);

if (!isProduction) bot.launch();

const botCommands = [
  {command: 'help', description: 'Помощь'},
  {command: 'schedule', description: 'Расписание на два дня'},
  {command: 'today', description: 'Расписание на сегодня'},
  {command: 'tomorrow', description: 'Расписание на завтра'},
  {command: 'groups', description: 'Показать все группы'},
  {command: 'setgroup', description: 'Выбрать группу по умолчанию'},
  {command: 'subscribe', description: 'Подписаться на обновления расписания'},
  {
    command: 'unsubscribe',
    description: 'Отписаться от обновлений расписания',
  },
];

bot.telegram.setMyCommands(botCommands);


const i18n = new TelegrafI18n({
  defaultLanguage: 'ru',
  allowMissing: false, // Default true
  directory: path.resolve(__dirname, 'locales'),
});

bot.use(i18n.middleware());

bot.on('text', require('./middlewares/log.middleware'));

bot.on('message', require('./middlewares/chat.middleware'));
bot.on('text', require('./middlewares/group.middleware'));

bot.use(require('./composers/start.composer'));
bot.use(require('./composers/main.composer'));
bot.use(require('./composers/subscribe.composer'));
bot.use(require('./composers/schedule.composer'));

module.exports = bot;
