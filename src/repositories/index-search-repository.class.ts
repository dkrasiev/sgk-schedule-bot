import { Index } from "flexsearch";
import { inject, injectable } from "inversify";

import { TYPES } from "../config/types.const";
import {
  IScheduleEntityRepository,
  ISearchRepository,
  ScheduleEntity,
} from "../modules/core";

@injectable()
export class FlexSearchRepository implements ISearchRepository {
  private index = new Index({
    tokenize: "full",
  });
  private isInited = false;

  constructor(
    @inject(TYPES.MainScheduleEntityRepository)
    private scheduleEntityRepository: IScheduleEntityRepository,
  ) {}

  public async search(query: string) {
    if (this.isInited === false) {
      await this.init();
    }

    return Promise.all(
      this.index
        .search(query)
        .map((id) => this.scheduleEntityRepository.getById(String(id))),
    ).then((result) => result.filter(Boolean) as ScheduleEntity[]);
  }

  private async init() {
    const entities = await this.scheduleEntityRepository.getAll();
    entities.forEach((e) => this.index.add(e.id, e.name));
  }
}
