import { AbstractScheduleEntityRepository } from '@modules/application'
import { IHTTPClient } from '@modules/http'

import { CabinetFactory } from './cabinet-factory.class'

export class HTTPCabinetRepository extends AbstractScheduleEntityRepository {
  constructor(
    private httpClient: IHTTPClient,
    private cabinetApiUrl: string,
  ) {
    super(new CabinetFactory())
  }

  protected async fetch() {
    return this.httpClient
      .get<Record<string, string>>(this.cabinetApiUrl)
      .then((data) => Object.entries(data).map(([id, name]) => ({ id, name })))
  }
}
