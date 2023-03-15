import dayjs from "dayjs";
import { Schedule } from "./schedule.interface";
import { ScheduleEntity } from "./schedule-entity.class";
import myAxios from "../axios";
import { SCHEDULE_URL } from "../config";

export class Cabinet extends ScheduleEntity {
  public async getSchedule(date = dayjs()): Promise<Schedule> {
    return myAxios
      .get(`${SCHEDULE_URL}/cabs/${this.formatDate(date)}/cabNum/${this.id}`)
      .then((response) => response.data);
  }
}
