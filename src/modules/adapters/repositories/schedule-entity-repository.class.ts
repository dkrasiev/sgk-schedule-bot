import { IScheduleEntityRepository } from '@modules/application'

export class ScheduleEntityRepository implements IScheduleEntityRepository {
  constructor(private repositories: IScheduleEntityRepository[]) {}

  public async getAll() {
    return Promise.all(this.repositories.map((r) => r.getAll())).then((v) =>
      v.flat(),
    )
  }

  public async getById(id: string) {
    return this.getAll().then((entities) => entities.find((e) => e.id === id))
  }
}
