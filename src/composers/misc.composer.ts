import { MyContext, trimCommand } from '@modules/common'
import { Composer } from 'grammy'

import { finder } from '../services/singleton-services'

const miscComposer = new Composer<MyContext>()

miscComposer.command('search', async (ctx) => {
  const query = trimCommand(ctx.message?.text || '')

  if (!query) {
    await ctx.reply(ctx.t('search_fail'))
    return
  }

  const result = finder.search(query)

  if (result.length === 0) {
    await ctx.reply(ctx.t('search_not_found'))
    return
  }

  try {
    await ctx.reply(
      ctx.t('search_found', {
        list: result.map((entity) => entity.name).join('\n'),
      }),
    )
  } catch (error) {
    await ctx.reply(ctx.t('search_too_many'))
  }
})

miscComposer.command('setdefault', async (ctx) => {
  const query = trimCommand(ctx.message?.text || '')

  if (!query) {
    await ctx.reply(ctx.t('set_default_fail'), { parse_mode: 'HTML' })
    return
  }

  const entity = finder.search(query)[0]

  if (entity) {
    ctx.session.default = entity.id
    await ctx.reply(ctx.t('set_default_success', { name: entity.name }))
    return
  }

  await ctx.reply(ctx.t('set_default_not_found'))
})

miscComposer.command('removedefault', async (ctx) => {
  if (ctx.session.default) {
    ctx.session.default = undefined
    await ctx.reply(ctx.t('remove_group_success'))
    return
  }

  await ctx.reply(ctx.t('remove_group_fail'))
})

export default miscComposer
