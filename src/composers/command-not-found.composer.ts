import { Composer } from 'grammy'

import { MyContext } from '../modules/common'

const commandNotFoundComposer = new Composer<MyContext>()

commandNotFoundComposer.on('message:text', async (ctx) => {
  if (
    ctx.message.text.startsWith('/') &&
    (ctx.chat.type === 'private' || ctx.message.text.includes(ctx.me.username))
  ) {
    // TODO: вынести в файл локалей
    await ctx.reply('Команда не найдена')
  }
})

export default commandNotFoundComposer
