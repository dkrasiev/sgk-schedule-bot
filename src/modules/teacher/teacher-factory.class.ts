import { IScheduleEntityFactory } from '../common'
import { Teacher } from './teacher.class'

export class TeacherFactory implements IScheduleEntityFactory<Teacher> {
  public createEntity(id: string, name: string) {
    return new Teacher(id, name)
  }
}
