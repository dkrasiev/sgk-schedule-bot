import {
  IScheduleRepository,
  Lesson,
  Schedule,
  ScheduleEntity,
} from '../../core'
import { IHTTPClient } from '../../http'

type IScheduleResponse = {
  date: string
  lessons: Array<{
    num: string
    title: string
    teachername: string
    cab: string
    nameGroup?: string
  }>
}

export abstract class BaseHTTPScheduleEntityRepository
  implements IScheduleRepository {
  abstract getApiUrl(entity: ScheduleEntity, date: Date): string

  constructor(private httpClient: IHTTPClient) { }

  public async getSchedule(entity: ScheduleEntity, date: Date) {
    const url = this.getApiUrl(entity, date)
    return this.httpClient
      .get<IScheduleResponse>(url)
      .then((r) => this.toDomain(r))
  }

  protected formatDate(date: Date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return [year, month, day].join('-')
  }

  private toDomain(obj: IScheduleResponse) {
    return new Schedule(
      obj.date,
      obj.lessons.map(
        (l) => new Lesson(l.num, l.title, l.teachername, l.cab, l.nameGroup),
      ),
    )
  }
}
