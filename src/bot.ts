import {Telegraf} from 'telegraf';
import {MyContext} from './types/context.type';
import {logComposer} from './composers/log.composer';
import {chatComposer} from './composers/chat.composer';
import {groupComposer} from './composers/group.composer';
import {mainComposer} from './composers/main.composer';
import {subscribeComposer} from './composers/subscribe.composer';
import {scheduleComposer} from './composers/schedule.composer';
import {startComposer} from './composers/start.composer';
import {i18n} from './i18n';

const isProduction = process.env.NODE_ENV === 'production';
const token = isProduction ? process.env.BOT_TOKEN : process.env.BOT_TOKEN_TEST;
if (!token) {
  console.error('bot token required');
  process.exit();
}

const bot = new Telegraf<MyContext>(token);

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

bot.use(i18n.middleware());

bot.use(logComposer);
bot.use(chatComposer);
bot.use(groupComposer);

bot.use(startComposer);
bot.use(mainComposer);
bot.use(subscribeComposer);

bot.use(scheduleComposer);

export default bot;
