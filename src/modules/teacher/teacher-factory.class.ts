import { IScheduleEntityFactory } from '@modules/application'

import { Teacher } from './teacher.class'

export class TeacherFactory implements IScheduleEntityFactory {
  public createEntity(id: string, name: string) {
    return new Teacher(id, name)
  }
}
