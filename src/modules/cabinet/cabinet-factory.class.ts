import { IScheduleEntityFactory } from '@modules/application'

import { Cabinet } from './cabinet.class'

export class CabinetFactory implements IScheduleEntityFactory {
  public createEntity(id: string, name: string) {
    return new Cabinet(id, name)
  }
}
