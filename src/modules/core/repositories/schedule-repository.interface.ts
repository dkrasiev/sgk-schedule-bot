import { Schedule } from '../entities/schedule.class'
import { ScheduleEntity } from '../entities/schedule-entity.class'

export interface IScheduleRepository {
  getSchedule(scheduleEntity: ScheduleEntity, date: Date): Promise<Schedule>
}
