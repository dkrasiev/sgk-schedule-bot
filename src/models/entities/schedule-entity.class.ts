import { Dayjs } from "dayjs";
import { DATE_FORMAT, SCHEDULE_URL } from "../../config";
import { Schedule } from "../schedule.interface";

export abstract class ScheduleEntity {
  protected scheduleUrl: string = SCHEDULE_URL;

  constructor(public id: string, public name: string) {}

  public abstract getSchedule(date: Dayjs): Promise<Schedule>;

  protected formatDate(date: Dayjs): string {
    return date.format(DATE_FORMAT);
  }
}
