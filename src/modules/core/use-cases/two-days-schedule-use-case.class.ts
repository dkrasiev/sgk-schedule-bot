import { IScheduleRepository, Schedule, ScheduleEntity } from '..'

export class TwoDaysScheduleUseCase {
  constructor(private scheduleRepository: IScheduleRepository) { }

  public execute(entity: ScheduleEntity): Promise<[Schedule, Schedule]> {
    const today = new Date()

    const firstDate = this.getWorkDate(today)
    const nextDayAfterFirstDate = new Date(firstDate)
    nextDayAfterFirstDate.setDate(nextDayAfterFirstDate.getDate() + 1)
    const secondDate = this.getWorkDate(nextDayAfterFirstDate)

    return Promise.all([
      this.scheduleRepository.getSchedule(entity, firstDate),
      this.scheduleRepository.getSchedule(entity, secondDate),
    ])
  }

  private getWorkDate(date: Date) {
    const resultDate = new Date(date)

    const day = date.getDay()
    let add = 0
    if (day === 6) {
      add += 1
    } else if (day === 5) {
      add += 2
    }
    resultDate.setDate(resultDate.getDate() + add)

    return resultDate
  }
}
