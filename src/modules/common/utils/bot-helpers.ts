import dayjs from 'dayjs'

import { MyContext } from '..'

export async function sendShortSchedule(
  ctx: MyContext,
  date = dayjs(),
): Promise<boolean> {
  console.log(ctx.message, date)
  return false
}

export async function sendSchedule(ctx: MyContext) {
  console.log(ctx.message)
}
