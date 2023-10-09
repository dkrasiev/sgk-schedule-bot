import { IDateRepository } from "../repositories/date-repository.interface";

export class DateService {
  constructor(private dateRepository: IDateRepository) {}

  public formatDate(date = new Date()) {
    return this.dateRepository.formatDate(date);
  }

  public getNextWeekday(date = new Date()) {
    return this.dateRepository.getNextWeekday(date);
  }
}
