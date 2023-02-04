import dayjs from "dayjs";

import axios from "../axios";
import { config } from "../config";
import { Schedule } from "../models/schedule.interface";
import { ScheduleType } from "../models/schedule.enum";
import logger from "../helpers/logger";

export class ScheduleService {
  constructor(private scheduleApi: string, private dateFormat: string) {}

  public async teacher(id: string | number, date = dayjs()): Promise<Schedule> {
    return this.getScheduleByType(id, date, ScheduleType.TEACHER);
  }

  public async group(id: string | number, date = dayjs()): Promise<Schedule> {
    return this.getScheduleByType(id, date, ScheduleType.GROUP);
  }

  public async cabinet(id: string, date = dayjs()): Promise<Schedule> {
    return this.getScheduleByType(id, date, ScheduleType.CABINET);
  }

  private async getScheduleByType(
    id: string | number,
    date = dayjs(),
    type = ScheduleType.GROUP
  ): Promise<Schedule> {
    const url: string = this.getUrlByType(id, date, type);

    const { data } = await axios.get<Schedule>(url);

    return data;
  }

  private getUrlByType(
    id: string | number,
    date = dayjs(),
    type = ScheduleType.GROUP
  ): string {
    const formatedDate: string = date.format(this.dateFormat);

    let url: string = this.scheduleApi;

    switch (type) {
      case ScheduleType.GROUP:
        url += `/${id}/${formatedDate}`;
        break;

      case ScheduleType.TEACHER:
        url += `/teacher/${formatedDate}/${id}`;
        break;

      case ScheduleType.CABINET:
        url += `/cabs/${formatedDate}/cabNum/${id}`;
        break;
    }

    logger.debug(url);

    return url;
  }
}

export const scheduleService = new ScheduleService(
  config.api.schedule,
  config.dateFormat
);

// https://asu.samgk.ru//api/schedule/${groupId}/${date}
// https://asu.samgk.ru//api/schedule/teacher/${date}/${teacherId}
// https://asu.samgk.ru//api/schedule/cabs/${date}/cabNum/${cabinetId}
