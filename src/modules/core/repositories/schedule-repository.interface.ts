import { Schedule } from "../models/schedule.class";
import { ScheduleEntity } from "../models/schedule-entity.class";

export interface IScheduleRepository {
  getSchedule(scheduleEntity: ScheduleEntity, date: Date): Promise<Schedule>;
}
