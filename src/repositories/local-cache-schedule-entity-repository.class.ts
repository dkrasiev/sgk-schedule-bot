import { IScheduleEntityRepository, ScheduleEntity } from '../modules/core'

export class LocalCacheScheduleEntityRepository
  implements IScheduleEntityRepository
{
  private entities: ScheduleEntity[] = []

  constructor(private scheduleEntityRepository: IScheduleEntityRepository) {}

  public async getAll(): Promise<ScheduleEntity[]> {
    if (this.entities.length > 0) {
      return this.entities
    }

    return this.scheduleEntityRepository
      .getAll()
      .then((entities) => (this.entities = entities))
  }

  public async getById(id: string): Promise<ScheduleEntity | undefined> {
    return this.getAll().then((entities) => entities.find((e) => e.id === id))
  }
}
