import { Composer } from 'grammy'

import { isAdmin, MyContext } from '../modules/common'
import { adminService } from '../services/singleton-services'

const adminComposer = new Composer<MyContext>()

adminComposer.command('broadcast', async (ctx, next) => {
  if (isAdmin(ctx.from?.username) === false) {
    await next()
    return
  }

  if (!ctx.message?.text) {
    await ctx.reply('Text not found')
    return
  }

  const message = ctx.message.text.slice(ctx.message.text.indexOf(' ') || 0)
  if (!message) {
    await ctx.reply('Message not found')
    return
  }

  await adminService.broadcastMessage(message, ctx)
})

export default adminComposer
