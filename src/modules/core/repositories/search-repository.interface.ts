import { ScheduleEntity } from "../models/schedule-entity.class";

export interface ISearchRepository<T extends ScheduleEntity = ScheduleEntity> {
  search(query: string): Promise<T[]>;
}
