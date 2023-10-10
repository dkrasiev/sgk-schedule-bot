import { ScheduleEntity } from '../../core'

export interface IScheduleEntityFactory<
  T extends ScheduleEntity = ScheduleEntity,
> {
  createEntity(id: string, name: string): T
}
