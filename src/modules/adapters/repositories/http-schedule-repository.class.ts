import { IScheduleRepository } from '@modules/application'
import { Cabinet } from '@modules/cabinet'
import { ScheduleEntity } from '@modules/domain'
import { Group } from '@modules/group'
import { Teacher } from '@modules/teacher'

export class HTTPScheduleRepository implements IScheduleRepository {
  constructor(
    private groupScheduleRepository: IScheduleRepository,
    private teacherScheduleRepository: IScheduleRepository,
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
