import { AbstractHTTPScheduleEntityRepository } from '@modules/application'
import { IHTTPClient } from '@modules/http'

import { Teacher } from './teacher.class'

export class HTTPTeacherScheduleRepository extends AbstractHTTPScheduleEntityRepository {
  constructor(
    private scheduleApiUrl: string,

    httpClient: IHTTPClient,
  ) {
    super(httpClient)
  }

  public getApiUrl(teacher: Teacher, date: Date): string {
    return `${this.scheduleApiUrl}/teacher/${this.formatDate(date)}/${
      teacher.id
    }`
  }
}
