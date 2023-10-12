import {
  IScheduleEntityRepository,
  ISearchRepository,
} from '@modules/application'

export class SearchRepository implements ISearchRepository {
  constructor(private scheduleEntityRepository: IScheduleEntityRepository) {}

  public async search(query: string) {
    const entities = await this.getEntities()
    return entities.filter(
      (entities) =>
        entities.id.includes(query) || entities.name.includes(query),
    )
  }

  private async getEntities() {
    return await this.scheduleEntityRepository.getAll()
  }
}
