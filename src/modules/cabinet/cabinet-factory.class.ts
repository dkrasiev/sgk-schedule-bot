import { IScheduleEntityFactory } from '../common'
import { Cabinet } from './cabinet.class'

export class CabinetFactory implements IScheduleEntityFactory<Cabinet> {
  public createEntity(id: string, name: string) {
    return new Cabinet(id, name)
  }
}
