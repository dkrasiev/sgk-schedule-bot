import { Schedule } from "../models/schedule.class";
import { ScheduleEntity } from "../models/schedule-entity.class";

// import { Cabinet } from "../models/cabinet.class";
// import { Group } from "../models/group.class";
// import { Teacher } from "../models/teacher.class";

export interface IScheduleRepository {
  getSchedule(scheduleEntity: ScheduleEntity, date: Date): Promise<Schedule>;
  // getCabinetSchedule(cabinet: Cabinet, date: Date): Promise<Schedule>;
  // getGroupSchedule(group: Group, date: Date): Promise<Schedule>;
  // getTeacherSchedule(teacher: Teacher, date: Date): Promise<Schedule>;
}
