import { Composer, InlineKeyboard } from 'grammy'

import { MyContext } from '../modules/common'

const startComposer = new Composer<MyContext>()

startComposer.command('start', async (ctx) => {
  if (!ctx.from) return

  await ctx.reply(ctx.t('welcome', { name: ctx.from.first_name }))
})

startComposer.command('help', async (ctx) => {
  await ctx.reply(ctx.t('help'), {
    reply_markup: new InlineKeyboard().url(
      'Предложения по улучшению можно написать сюда',
      'https://t.me/dkrasiev',
    ),
    parse_mode: 'HTML',
  })
})

export default startComposer
