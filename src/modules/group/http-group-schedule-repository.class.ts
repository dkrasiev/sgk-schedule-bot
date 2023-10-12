import { AbstractHTTPScheduleEntityRepository } from '@modules/application'
import { IHTTPClient } from '@modules/http'

import { Group } from './group.class'

export class HTTPGroupScheduleRepository extends AbstractHTTPScheduleEntityRepository {
  constructor(
    private scheduleApiUrl: string,

    httpClient: IHTTPClient,
  ) {
    super(httpClient)
  }

  public getApiUrl(group: Group, date: Date): string {
    return `${this.scheduleApiUrl}/${group.id}/${this.formatDate(date)}`
  }
}
