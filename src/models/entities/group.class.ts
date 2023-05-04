import dayjs from "dayjs";
import myAxios from "../../axios";
import { Schedule } from "../schedule.interface";
import { ScheduleEntity } from "./schedule-entity.class";

export class Group extends ScheduleEntity {
  public async getSchedule(date = dayjs()): Promise<Schedule> {
    return myAxios
      .get(`${this.scheduleUrl}/${this.id}/${this.formatDate(date)}`)
      .then((response) => response.data);
  }
}
