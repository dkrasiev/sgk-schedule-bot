import { AxiosInstance } from "axios";
import dayjs from "dayjs";
import { inject, injectable } from "inversify";

import config from "../config/config";
import { TYPES } from "../config/types.const";
import {
  Cabinet,
  Group,
  IScheduleRepository,
  ScheduleEntity,
  Teacher,
} from "../modules/core";

@injectable()
export class ScheduleRepository implements IScheduleRepository {
  constructor(
    @inject(TYPES.ScheduleApiUrl) private scheduleApiUrl: string,
    @inject(TYPES.Axios) private axios: AxiosInstance,
    @inject(TYPES.DateFormat) private dateFormat: string,
  ) {}

  public async getSchedule(entity: ScheduleEntity, date = new Date()) {
    if (entity instanceof Group) {
      return this.axios
        .get(`${this.scheduleApiUrl}/${entity.id}/${this.formatDate(date)}`)
        .then((r) => r.data);
    }

    if (entity instanceof Teacher) {
      return this.axios
        .get(
          `${this.scheduleApiUrl}/teacher/${this.formatDate(date)}/${
            entity.id
          }`,
        )
        .then((r) => r.data);
    }

    if (entity instanceof Cabinet) {
      return this.axios
        .get(
          `${this.scheduleApiUrl}/cabs/${this.formatDate(date)}/cabNum/${
            entity.id
          }`,
        )
        .then((r) => r.data);
    }

    throw new Error("Unknown ScheduleEntity");
  }

  private formatDate(date: Date) {
    return dayjs(date).format(config.DATE_FORMAT);
  }
}
