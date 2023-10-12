import { Schedule, ScheduleEntity } from '@modules/domain'

export interface IScheduleRepository {
  getSchedule(entity: ScheduleEntity, date: Date): Promise<Schedule>
}
