import { ScheduleEntity } from '../entities/schedule-entity.class'

export interface IScheduleEntityRepository<
  T extends ScheduleEntity = ScheduleEntity,
> {
  getAll(): Promise<T[]>
  getById(id: string): Promise<T | undefined>
}
