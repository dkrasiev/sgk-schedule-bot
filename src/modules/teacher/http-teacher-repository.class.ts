import { AbstractScheduleEntityRepository } from '@modules/application'
import { IHTTPClient } from '@modules/http'

import { TeacherFactory } from './teacher-factory.class'

export class HTTPTeacherRepository extends AbstractScheduleEntityRepository {
  constructor(
    private httpClient: IHTTPClient,
    private teacherApiUrl: string,
  ) {
    super(new TeacherFactory())
  }

  protected async fetch() {
    return this.httpClient.get<Array<{ id: string; name: string }>>(
      this.teacherApiUrl,
    )
  }
}
