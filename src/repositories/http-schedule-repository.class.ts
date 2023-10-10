import { inject, injectable } from 'inversify'

import { TYPES } from '../config/types.const'
import { Cabinet } from '../modules/cabinet'
import { IScheduleRepository, ScheduleEntity } from '../modules/core'
import { Group } from '../modules/group'
import { Teacher } from '../modules/teacher'

@injectable()
export class HTTPScheduleRepository implements IScheduleRepository {
  constructor(
    @inject(TYPES.GroupScheduleRepository)
    private groupScheduleRepository: IScheduleRepository,
    @inject(TYPES.TeacherScheduleRepository)
    private teacherScheduleRepository: IScheduleRepository,
    @inject(TYPES.CabinetScheduleRepository)
    private cabinetScheduleRepository: IScheduleRepository,
  ) {}

  public async getSchedule(entity: ScheduleEntity, date = new Date()) {
    if (entity instanceof Group) {
      return this.groupScheduleRepository.getSchedule(entity, date)
    }

    if (entity instanceof Teacher) {
      return this.teacherScheduleRepository.getSchedule(entity, date)
    }

    if (entity instanceof Cabinet) {
      return this.cabinetScheduleRepository.getSchedule(entity, date)
    }

    throw new Error('Unknown ScheduleEntity')
  }
}
