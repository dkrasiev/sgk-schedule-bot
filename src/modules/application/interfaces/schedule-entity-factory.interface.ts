import { ScheduleEntity } from '@modules/domain'

export interface IScheduleEntityFactory {
  createEntity(id: string, name: string): ScheduleEntity
}
