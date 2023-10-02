import { IScheduleEntityRepository } from "../repositories/schedule-entity-repository.interface";
import { ISearchRepository } from "../repositories/search-repository.interface";

export class ScheduleEntityService {
  constructor(
    private scheduleEntityRepository: IScheduleEntityRepository,
    private searchRepository: ISearchRepository,
  ) {}

  public getAll() {
    return this.scheduleEntityRepository.getAll();
  }

  public find(query: string) {
    return this.searchRepository.find(query);
  }

  public search(query: string) {
    return this.searchRepository.search(query);
  }
}
