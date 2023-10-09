import { Schedule } from "../models/schedule.class";
import { ScheduleEntity } from "../models/schedule-entity.class";
import { IDateRepository } from "../repositories/date-repository.interface";
import { IScheduleRepository } from "../repositories/schedule-repository.interface";

export class ScheduleService {
  constructor(
    private scheduleRepository: IScheduleRepository,
    private dateRepository: IDateRepository,
  ) {}

  public async getSchedule(entity: ScheduleEntity, date = new Date()) {
    const nextWeekday = this.getNextWeekday(date);
    return await this.scheduleRepository.getSchedule(entity, nextWeekday);
  }

  public async getScheduleForTwoDays(
    entity: ScheduleEntity,
    date = new Date(),
  ): Promise<[Schedule, Schedule]> {
    const firstDate = this.getNextWeekday(date);
    const secondDate = this.getNextWeekday(firstDate, 1);

    const firstSchedule = await this.scheduleRepository.getSchedule(
      entity,
      firstDate,
    );
    const secondSchedule = await this.scheduleRepository.getSchedule(
      entity,
      secondDate,
    );

    return [firstSchedule, secondSchedule];
  }

  private getNextWeekday(date: Date, offset: number = 0) {
    const myDate = new Date(date);
    myDate.setDate(date.getDate() + offset);

    return this.dateRepository.getNextWeekday(date);
  }
}
