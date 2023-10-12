import { IScheduleEntityRepository } from '@modules/application'
import { ScheduleEntity } from '@modules/domain'

export class AggregateScheduleEntityRepository
  implements IScheduleEntityRepository
{
  private entities: ScheduleEntity[] = []

  constructor(private repositories: IScheduleEntityRepository[]) {}

  public async getAll() {
    if (this.entities.length > 0) {
      return this.entities
    }

    return Promise.all(this.repositories.map((r) => r.getAll()))
      .then((result) => result.flat() as ScheduleEntity[])
      .then((entities) => (this.entities = entities))
  }
}
