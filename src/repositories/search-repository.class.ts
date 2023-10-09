import { inject, injectable } from "inversify";

import { TYPES } from "../config/types.const";
import { IScheduleEntityRepository, ISearchRepository } from "../modules/core";

@injectable()
export class SearchRepository implements ISearchRepository {
  constructor(
    @inject(TYPES.MainScheduleEntityRepository)
    private scheduleEntityRepository: IScheduleEntityRepository,
  ) {}

  public async search(query: string) {
    const entities = await this.getEntities();
    return entities.filter(
      (entities) =>
        entities.id.includes(query) || entities.name.includes(query),
    );
  }

  private async getEntities() {
    return await this.scheduleEntityRepository.getAll();
  }
}
