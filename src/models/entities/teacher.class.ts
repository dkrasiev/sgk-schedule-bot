import dayjs from "dayjs";
import myAxios from "../../axios";
import { Schedule } from "../schedule.interface";
import { ScheduleEntity } from "./schedule-entity.class";

export class Teacher extends ScheduleEntity {
  public async getSchedule(date = dayjs()): Promise<Schedule> {
    return myAxios
      .get(`${this.scheduleUrl}/teacher/${this.formatDate(date)}/${this.id}`)
      .then((response) => response.data);
  }
}
