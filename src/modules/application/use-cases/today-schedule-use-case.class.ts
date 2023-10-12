import { ScheduleEntity } from '@modules/domain'

import { IScheduleRepository } from '../interfaces/schedule-repository.interface'

export class TodayScheduleUseCase {
  constructor(private scheduleRepository: IScheduleRepository) {}

  public async execute(entity: ScheduleEntity) {
    const today = new Date()
    return this.scheduleRepository.getSchedule(entity, today)
  }
}
