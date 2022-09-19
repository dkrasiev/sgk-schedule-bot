const {chats} = require('../models');

module.exports = async (ctx, next) => {
  if (!(await chats.findOne({id: ctx.chat.id}))) {
    await chats.create({id: ctx.chat.id});
  }

  next();
};
