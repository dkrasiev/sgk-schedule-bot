import { inject, injectable } from 'inversify'

import { TYPES } from '../config/types.const'
import { IScheduleEntityRepository, ISearchRepository } from '../modules/core'

@injectable()
export class SimpleSearchRepository implements ISearchRepository {
  constructor(
    @inject(TYPES.MainScheduleEntityRepository)
    private scheduleEntityRepository: IScheduleEntityRepository,
  ) {}

  public async search(query: string) {
    const q = query.toLowerCase()
    return this.scheduleEntityRepository
      .getAll()
      .then((entities) =>
        entities.filter(
          (e) => e.id.includes(q) || e.name.toLowerCase().includes(q),
        ),
      )
  }
}
