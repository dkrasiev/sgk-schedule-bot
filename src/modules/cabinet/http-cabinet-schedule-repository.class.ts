import { BaseHTTPScheduleEntityRepository } from '../common/classes/base-http-schedule-entity-repository.class'
import { IHTTPClient } from '../http'
import { Cabinet } from './cabinet.class'

export class HTTPCabinetScheduleRepository extends BaseHTTPScheduleEntityRepository {
  constructor(
    private scheduleApiUrl: string,

    httpClient: IHTTPClient,
  ) {
    super(httpClient)
  }

  public getApiUrl(cabinet: Cabinet, date: Date): string {
    return `${this.scheduleApiUrl}/cabs/${this.formatDate(date)}/cabNum/${cabinet.id
      }`
  }
}
