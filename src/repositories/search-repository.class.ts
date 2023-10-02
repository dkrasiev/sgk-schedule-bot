import { inject, injectable } from "inversify";

import { TYPES } from "../config/types.const";
import { IScheduleEntityRepository, ISearchRepository } from "../modules/core";

@injectable()
export class SearchRepository implements ISearchRepository {
  constructor(
    @inject(TYPES.ScheduleEntityRepository)
    private scheduleEntityRepository: IScheduleEntityRepository,
  ) {}

  public async find(query: string) {
    return (await this.scheduleEntityRepository.getAll()).find(
      (entities) =>
        entities.id.includes(query) || entities.name.includes(query),
    );
  }

  public async search(query: string) {
    return (await this.scheduleEntityRepository.getAll()).filter(
      (entities) =>
        entities.id.includes(query) || entities.name.includes(query),
    );
  }
}
