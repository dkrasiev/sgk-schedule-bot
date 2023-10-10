import { IScheduleEntityFactory } from '../common/interfaces/schedule-entity-factory.interface'
import { Group } from './group.class'

export class GroupFactory implements IScheduleEntityFactory<Group> {
  public createEntity(id: string, name: string) {
    return new Group(id, name)
  }
}
