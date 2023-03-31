import { Dayjs } from "dayjs";
import { Schedule } from "./schedule.interface";
import { DATE_FORMAT } from "../config";

export abstract class ScheduleEntity {
  constructor(public id: string, public name: string) {}

  public abstract getSchedule(date: Dayjs): Promise<Schedule>;

  protected formatDate(date: Dayjs): string {
    return date.format(DATE_FORMAT);
  }
}
