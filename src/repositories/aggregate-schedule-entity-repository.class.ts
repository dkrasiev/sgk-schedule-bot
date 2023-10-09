import { injectable, multiInject } from "inversify";

import { TYPES } from "../config/types.const";
import { IScheduleEntityRepository, ScheduleEntity } from "../modules/core";
import { BaseScheduleEntityRepository } from "./base-schedule-entity-repository.class";

@injectable()
export class AggregateScheduleEntityRepository extends BaseScheduleEntityRepository {
  private entities: ScheduleEntity[] = [];

  constructor(
    @multiInject(TYPES.ScheduleEntityRepository)
    private repositories: IScheduleEntityRepository[],
  ) {
    super();
  }

  public async getAll() {
    if (this.entities.length > 0) {
      return this.entities;
    }

    return Promise.all(this.repositories.map((r) => r.getAll()))
      .then((result) => result.flat() as ScheduleEntity[])
      .then((entities) => (this.entities = entities));
  }
}
