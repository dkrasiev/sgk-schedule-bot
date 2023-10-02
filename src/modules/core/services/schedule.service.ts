import { ScheduleEntity } from "../models/schedule-entity.class";
import { IScheduleRepository } from "../repositories/schedule-repository.interface";

export class ScheduleService {
  constructor(private scheduleRepository: IScheduleRepository) {}

  public getSchedule(entity: ScheduleEntity, date = new Date()) {
    return this.scheduleRepository.getSchedule(entity, date);
  }
}
