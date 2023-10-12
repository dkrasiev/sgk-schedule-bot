import { IScheduleEntityFactory } from '@modules/application'

import { Group } from './group.class'

export class GroupFactory implements IScheduleEntityFactory {
  public createEntity(id: string, name: string) {
    return new Group(id, name)
  }
}
