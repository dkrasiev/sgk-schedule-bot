import { AbstractHTTPScheduleEntityRepository } from '@modules/application'
import { IHTTPClient } from '@modules/http'

import { Cabinet } from './cabinet.class'

export class HTTPCabinetScheduleRepository extends AbstractHTTPScheduleEntityRepository {
  constructor(
    private scheduleApiUrl: string,

    httpClient: IHTTPClient,
  ) {
    super(httpClient)
  }

  public getApiUrl(cabinet: Cabinet, date: Date): string {
    return `${this.scheduleApiUrl}/cabs/${this.formatDate(date)}/cabNum/${
      cabinet.id
    }`
  }
}
