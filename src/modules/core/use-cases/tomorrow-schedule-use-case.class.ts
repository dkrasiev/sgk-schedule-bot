import { IScheduleRepository, ScheduleEntity } from '..'

export class TomorrowScheduleUseCase {
  constructor(private scheduleRepository: IScheduleRepository) {}

  public async execute(entity: ScheduleEntity) {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return this.scheduleRepository.getSchedule(entity, tomorrow)
  }
}
