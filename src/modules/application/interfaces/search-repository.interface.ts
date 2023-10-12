import { ScheduleEntity } from '@modules/domain'

export interface ISearchRepository {
  search(query: string): Promise<ScheduleEntity[]>
}
