import {Composer, Markup} from 'telegraf';
import {MyContext} from '../types/context.type';

const startComposer = new Composer<MyContext>();

startComposer.start(async (ctx) => {
  if (!ctx.from) return;

  const name = ctx.from.last_name ?
    `${ctx.from.first_name} ${ctx.from.last_name}` :
    ctx.from.first_name;

  await ctx.reply(ctx.i18n.t('welcome', {name}));
});

startComposer.help(async (ctx) => {
  await ctx.replyWithMarkdownV2(
      ctx.i18n.t('help'),
      Markup.inlineKeyboard([
        {
          text: 'По возникшим вопросам можно написать сюда',
          url: 't.me/dkrasiev',
        },
      ]),
  );
});

export default startComposer;
