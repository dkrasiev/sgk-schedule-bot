import { IScheduleEntityFactory } from '../common'
import { IScheduleEntityRepository } from '../core'
import { IHTTPClient } from '../http'
import { Cabinet } from './cabinet.class'

export class HTTPCabinetRepository
  implements IScheduleEntityRepository<Cabinet>
{
  constructor(
    private httpClient: IHTTPClient,
    private cabinetFactory: IScheduleEntityFactory<Cabinet>,
    private cabinetApiUrl: string,
  ) { }

  public async getAll() {
    return this.httpClient
      .get<Record<string, string>>(this.cabinetApiUrl)
      .then((data) =>
        Object.entries(data).map(([id, name]) =>
          this.cabinetFactory.createEntity(id, name),
        ),
      )
  }

  public async getById(id: string) {
    return this.getAll().then((entities) => entities.find((e) => e.id === id))
  }
}
