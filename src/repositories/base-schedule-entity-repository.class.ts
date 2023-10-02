import { injectable } from "inversify";

import { IGroupRepository, ScheduleEntity } from "../modules/core";

@injectable()
export abstract class BaseScheduleEntityRepository<
  T extends ScheduleEntity = ScheduleEntity,
> implements IGroupRepository
{
  abstract getAll(): Promise<T[]>;

  public async getById(id: string) {
    return this.getAll().then((groups) => groups.find((g) => g.id === id));
  }

  public async find(query: string) {
    return this.getAll().then((groups) =>
      groups.find((g) => g.id.includes(query) || g.name.includes(query)),
    );
  }

  public async search(query: string) {
    return this.getAll().then((groups) =>
      groups.filter((g) => g.id.includes(query) || g.name.includes(query)),
    );
  }
}
