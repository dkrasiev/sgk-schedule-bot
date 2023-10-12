import {
  IScheduleEntityRepository,
  ISearchRepository,
} from '@modules/application'

export class SimpleSearchRepository implements ISearchRepository {
  constructor(private scheduleEntityRepository: IScheduleEntityRepository) {}

  public async search(query: string) {
    const q = query.toLowerCase()
    return this.scheduleEntityRepository
      .getAll()
      .then((entities) =>
        entities.filter(
          (e) => e.id.includes(q) || e.name.toLowerCase().includes(q),
        ),
      )
  }
}
