const {getGroupFromString} = require('../utils');
const {chats, groups} = require('../models');

module.exports = async (ctx, next) => {
  ctx.data = {};

  const chat = await chats.findOne({id: ctx.chat.id});
  const groupFromMessage = await getGroupFromString(ctx.message.text);
  const groupFromChat = await groups.findOne({id: chat.defaultGroup});

  ctx.data.group = groupFromMessage || groupFromChat;
  if (groupFromMessage) ctx.message.hasGroup = true;

  next();
};
