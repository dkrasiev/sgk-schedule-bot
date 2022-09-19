const {log} = require('../utils');

module.exports = async (ctx, next) => {
  log(ctx.message.text);

  next();
};
