import cronparser from 'cron-parser'
import dayjs from 'dayjs'
import humanizeDuration from 'humanize-duration'
import cron from 'node-cron'

import logger from '../config/logger'
import { CounterService } from './message-counter.service'

export class LoadWatchService {
  private duration: string

  constructor(
    private counter: CounterService,
    private cronExpression = '*/60 * * * *', // every hour by default
  ) {
    const parsedCronExpression = cronparser.parseExpression(this.cronExpression)

    const prev = dayjs(parsedCronExpression.prev().toDate())
    const next = dayjs(parsedCronExpression.next().toDate())
    const ms = next.diff(prev, 'ms')

    this.duration = humanizeDuration(ms)

    cron.schedule(this.cronExpression, () => {
      logger.info(`In ${this.duration} got ${this.counter.getCount()} messages`)

      this.counter.reset()
    })
  }
}
