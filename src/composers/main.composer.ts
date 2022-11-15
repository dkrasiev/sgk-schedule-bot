import {Composer} from 'telegraf';
import {chats, groups} from '../models';
import {getGroupFromString} from '../utils';
import {MyContext} from '../types/context.type';

const mainComposer = new Composer<MyContext>();

mainComposer.command('groups', async (ctx) => {
  const groupsArray = await groups.find();

  const groupsNameArray = groupsArray
      .map((group) => group.name)
      .sort((a, b) => a.localeCompare(b));

  await ctx.reply(groupsNameArray.join('\n'));
});

mainComposer.command('setgroup', async (ctx) => {
  const chat = await chats.findOne({id: ctx.chat.id});
  const group = await getGroupFromString(ctx.message.text);

  if (group && chat) {
    chat.defaultGroup = group.id;
    await chat.save();
    await ctx.reply(ctx.i18n.t('set_group_success', {group}));
  } else {
    await ctx.replyWithMarkdownV2(ctx.i18n.t('set_group_fail'));
  }
});

mainComposer.command('removedefault', async (ctx) => {
  const chat = await chats.findOne({id: ctx.chat.id});

  if (chat?.defaultGroup) {
    chat.defaultGroup = undefined;
    await chat.save();
    await ctx.reply(ctx.i18n.t('remove_group_success'));
    return;
  }

  await ctx.reply(ctx.i18n.t('remove_group_fail'));
});

export default mainComposer;
