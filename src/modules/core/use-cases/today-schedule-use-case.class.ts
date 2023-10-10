import { IScheduleRepository, ScheduleEntity } from '..'

export class TodayScheduleUseCase {
  constructor(private scheduleRepository: IScheduleRepository) {}

  public async execute(entity: ScheduleEntity) {
    const today = new Date()
    return this.scheduleRepository.getSchedule(entity, today)
  }
}
