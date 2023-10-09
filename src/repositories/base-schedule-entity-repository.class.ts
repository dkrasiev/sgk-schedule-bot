import { injectable } from "inversify";

import { IScheduleEntityRepository, ScheduleEntity } from "../modules/core";

@injectable()
export abstract class BaseScheduleEntityRepository<
  T extends ScheduleEntity = ScheduleEntity,
> implements IScheduleEntityRepository<T>
{
  abstract getAll(): Promise<T[]>;

  public async getById(id: string) {
    const entities = await this.getAll();
    return entities.find((e) => e.id === id);
  }
}
