import { ScheduleEntity } from "../models/schedule-entity.class";

export interface IScheduleEntityRepository {
  getAll(): Promise<ScheduleEntity[]>;
  find(query: string): Promise<ScheduleEntity | undefined>;
  search(query: string): Promise<ScheduleEntity[]>;
}
