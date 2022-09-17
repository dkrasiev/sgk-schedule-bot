const {default: axios} = require('axios');
const dayjs = require('dayjs');
const {Telegraf} = require('telegraf');

const bot = new Telegraf(
    process.env.BOT_TOKEN || '5763964960:AAH43TSsBdGgkMd28ZPAw1NyvNVo05yKNrs',
);

const SCHEDULE_API = 'https://asu.samgk.ru/api/schedule';

const botCommands = [{command: 'schedule', description: 'Скинуть расписание'}];

bot.telegram.setMyCommands(botCommands);

bot.start((ctx) => {
  let startMessage = `Привет, ${ctx.from.first_name}!\n`;
  startMessage += 'Чтобы узнать как я работаю, напиши /help';

  ctx.reply(startMessage);
});

bot.help((ctx) => {
  const helpMessage = 'Для получения расписания введи команды /schedule';
  ctx.reply(helpMessage);
});

bot.command('schedule', async (ctx) => {
  try {
    const response = await axios.get(
        SCHEDULE_API + '/187/' + dayjs().format('YYYY-MM-DD'),
    );

    const schedule = response.data;

    ctx.reply(getScheduleMessage(schedule));
  } catch (error) {
    bot.telegram.sendMessage(748299957, error?.message);
  }
});

/**
 * Получение сообщения для отправки пользователю
 * @param {any} schedule объект расписания
 * @return {string} сообщение для пользователя
 */
function getScheduleMessage(schedule) {
  if (!schedule?.lessons?.length) return 'Расписания нет';

  let message = `${schedule.date}\n\n`;

  if (schedule.lessons.length > 0) {
    for (const lesson of schedule.lessons) {
      message =
    message +
    `${lesson.num}\n${lesson.title}\n${lesson.teachername}\n${lesson.cab}\n\n`;
    }
  }

  return message;
}

// for yandex cloud function
module.exports.handler = async function(event) {
  const message = JSON.parse(event.body);
  await bot.handleUpdate(message);
  return {
    statusCode: 200,
    body: '',
  };
};
