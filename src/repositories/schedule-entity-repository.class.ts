import { injectable, multiInject } from 'inversify'

import { TYPES } from '../config/types.const'
import { IScheduleEntityRepository } from '../modules/core'

@injectable()
export class ScheduleEntityRepository implements IScheduleEntityRepository {
  constructor(
    @multiInject(TYPES.ScheduleEntityRepository)
    private repositories: IScheduleEntityRepository[],
  ) {}

  public async getAll() {
    return Promise.all(this.repositories.map((r) => r.getAll())).then((v) =>
      v.flat(),
    )
  }

  public async getById(id: string) {
    return this.getAll().then((entities) => entities.find((e) => e.id === id))
  }
}
