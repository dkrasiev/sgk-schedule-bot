import dayjs from "dayjs";
import { ScheduleEntity } from "./schedule-entity.class";
import { Schedule } from "./schedule.interface";
import myAxios from "../axios";
import { SCHEDULE_URL } from "../config";

export class Teacher extends ScheduleEntity {
  public async getSchedule(date = dayjs()): Promise<Schedule> {
    return myAxios
      .get(`${SCHEDULE_URL}/teacher/${this.formatDate(date)}/${this.id}`)
      .then((response) => response.data);
  }
}
