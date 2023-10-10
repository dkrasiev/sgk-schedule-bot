import { BaseHTTPScheduleEntityRepository } from '../common/classes/base-http-schedule-entity-repository.class'
import { IHTTPClient } from '../http'
import { Teacher } from './teacher.class'

export class HTTPTeacherScheduleRepository extends BaseHTTPScheduleEntityRepository {
  constructor(
    private scheduleApiUrl: string,

    httpClient: IHTTPClient,
  ) {
    super(httpClient)
  }

  public getApiUrl(teacher: Teacher, date: Date): string {
    return `${this.scheduleApiUrl}/teacher/${this.formatDate(date)}/${teacher.id
      }`
  }
}
