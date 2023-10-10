import dayjs from 'dayjs'
import { inject, injectable } from 'inversify'

import { TYPES } from '../config/types.const'
import { IDateRepository } from '../modules/core'

@injectable()
export class DayjsDateRepository implements IDateRepository {
  constructor(@inject(TYPES.DateFormat) private dateFormat: string) {}

  public formatDate(date: Date) {
    return dayjs(date).format(this.dateFormat)
  }

  public getNextWeekday(date: Date) {
    const myDate = dayjs(date)

    if (myDate.day() === 0) {
      return myDate.add(1, 'day').toDate()
    }

    if (myDate.day() === 6) {
      return myDate.add(2, 'day').toDate()
    }

    return myDate.toDate()
  }
}
