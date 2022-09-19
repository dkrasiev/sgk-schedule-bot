const {Composer} = require('telegraf');
const composer = new Composer();

composer.start(async (ctx) => {
  const name = ctx.from.last_name ?
    `${ctx.from.first_name} ${ctx.from.last_name}` :
    ctx.from.first_name;

  await ctx.reply(ctx.i18n.t('welcome', {name}));
});

composer.help(async (ctx) => {
  await ctx.replyWithMarkdown(ctx.i18n.t('help'));
});

module.exports = composer;
