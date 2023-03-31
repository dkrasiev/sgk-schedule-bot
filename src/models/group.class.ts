import dayjs from "dayjs";
import { ScheduleEntity } from "./schedule-entity.class";
import { Schedule } from "./schedule.interface";
import myAxios from "../axios";
import { SCHEDULE_URL } from "../config";

export class Group extends ScheduleEntity {
  public async getSchedule(date = dayjs()): Promise<Schedule> {
    return myAxios
      .get(`${SCHEDULE_URL}/${this.id}/${this.formatDate(date)}`)
      .then((response) => response.data);
  }
}
