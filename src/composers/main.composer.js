const {Composer} = require('telegraf');
const {chats, groups} = require('../models');
const {getGroupFromString} = require('../utils');

const composer = new Composer();

composer.command('groups', async (ctx) => {
  let groupsArray = await groups.find();

  groupsArray = groupsArray
      .map((group) => group.name)
      .sort((a, b) => a.localeCompare(b));

  await ctx.reply(groupsArray.join('\n'));
});

composer.command('setgroup', async (ctx) => {
  const chat = await chats.findOne({id: ctx.chat.id});
  const group = await getGroupFromString(ctx.message.text);

  if (group) {
    chat.defaultGroup = group.id;
    await chat.save();
    await ctx.reply('Установлена группа ' + group.name);
  } else {
    await ctx.reply('Группа не найдена или Вы ничего не ввели');
  }
});

composer.command('removedefault', async (ctx) => {
  const chat = await chats.findOne({id: ctx.chat.id});

  if (chat.defaultGroup) {
    chat.defaultGroup = null;
    await chat.save();
    await ctx.reply('Группа по умолчанию удалена');
    return;
  }

  await ctx.reply('Группа по умолчанию не выбрана');
});

module.exports = composer;
