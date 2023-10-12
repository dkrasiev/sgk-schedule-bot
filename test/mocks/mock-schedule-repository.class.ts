import { IScheduleRepository } from '../../src/modules/application'
import { Schedule,ScheduleEntity } from '../../src/modules/domain'

export class MockScheduleRepository implements IScheduleRepository {
  public async getSchedule(
    _scheduleEntity: ScheduleEntity,
    date: Date,
  ): Promise<Schedule> {
    return new Schedule(date.toString(), [])
  }
}
