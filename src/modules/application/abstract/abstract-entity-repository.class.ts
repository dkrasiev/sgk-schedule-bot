import {
  IScheduleEntityFactory,
  IScheduleEntityRepository,
} from '@modules/application'
import { ScheduleEntity } from '@modules/domain'

export abstract class AbstractScheduleEntityRepository
  implements IScheduleEntityRepository
{
  constructor(private entityFactory: IScheduleEntityFactory) {}

  protected abstract fetch(): Promise<{ id: string; name: string }[]>

  public async getAll(): Promise<ScheduleEntity[]> {
    return this.fetch().then((data) =>
      data.map(({ id, name }) => this.entityFactory.createEntity(id, name)),
    )
  }
}
