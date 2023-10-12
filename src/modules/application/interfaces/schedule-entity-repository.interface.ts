import { ScheduleEntity } from '@modules/domain'

export interface IScheduleEntityRepository {
  getAll(): Promise<ScheduleEntity[]>
}
