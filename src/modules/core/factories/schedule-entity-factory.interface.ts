import { ScheduleEntity } from "../models/schedule-entity.class";

export interface IScheduleEntityFactory<
  T extends ScheduleEntity = ScheduleEntity,
> {
  createEntity(id: string, name: string): T;
}
