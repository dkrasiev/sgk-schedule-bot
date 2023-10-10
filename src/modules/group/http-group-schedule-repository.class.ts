import { BaseHTTPScheduleEntityRepository } from '../common/classes/base-http-schedule-entity-repository.class'
import { IHTTPClient } from '../http'
import { Group } from './group.class'

export class HTTPGroupScheduleRepository extends BaseHTTPScheduleEntityRepository {
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
