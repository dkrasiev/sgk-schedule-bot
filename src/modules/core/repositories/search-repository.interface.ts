import { ScheduleEntity } from '../entities/schedule-entity.class'

export interface ISearchRepository<T extends ScheduleEntity = ScheduleEntity> {
  search(query: string): Promise<T[]>
}
