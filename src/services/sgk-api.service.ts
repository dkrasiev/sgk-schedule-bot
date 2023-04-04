import dayjs, { Dayjs } from "dayjs";

import myAxios from "../axios";
import {
  CABINETS_URL,
  DATE_FORMAT,
  GROUPS_URL,
  SCHEDULE_URL,
  TEACHERS_URL,
} from "../config";
import { Cabinet } from "../models/cabinet.class";
import { Group } from "../models/group.class";
import { Schedule } from "../models/schedule.interface";
import { Teacher } from "../models/teacher.class";

export class SGKApiService {
  private api = SCHEDULE_URL;

  public async getGroups(): Promise<Group[]> {
    return myAxios
      .get<{ id: number; name: string }[]>(GROUPS_URL)
      .then((response) =>
        response.data.map(({ id, name }) => new Group(id.toString(), name))
      );
  }

  public async getTeachers(): Promise<Teacher[]> {
    return myAxios
      .get<{ id: string; name: string }[]>(TEACHERS_URL)
      .then((response) =>
        response.data.map(({ id, name }) => new Teacher(id, name))
      );
  }

  public async getCabinets(): Promise<Cabinet[]> {
    return myAxios
      .get<{ [key: string]: string }>(CABINETS_URL)
      .then((response) =>
        Object.entries(response.data).map(([id, name]) => new Cabinet(id, name))
      );
  }

  public async getSchedule(
    entity: Group | Teacher | Cabinet,
    date: Dayjs
  ): Promise<Schedule> {
    const url = this.getScheduleUrl(entity, date);
    return myAxios.get<Schedule>(url).then((response) => response.data);
  }

  private getScheduleUrl(
    entity: Group | Teacher | Cabinet,
    date: Dayjs
  ): string {
    const url = this.api;

    if (entity instanceof Group) {
      return url + `/${entity.id}/${this.formatDate(date)}`;
    }

    if (entity instanceof Teacher) {
      return url + `/teacher/${this.formatDate(date)}/${entity.id}`;
    }

    if (entity instanceof Cabinet) {
      return url + `/cabs/${this.formatDate(date)}/cabNum/${entity.id}`;
    }

    throw new Error("passed wrong value");
  }

  private formatDate(date = dayjs()): string {
    return date.format(DATE_FORMAT);
  }
}

export const sgkApi = new SGKApiService();
