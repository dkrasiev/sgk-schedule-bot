import { ScheduleEntity } from "../models/schedule-entity.class";

export interface ISearchRepository<T extends ScheduleEntity = ScheduleEntity> {
  find(query: string): Promise<T | undefined>;
  search(query: string): Promise<T[]>;
}
