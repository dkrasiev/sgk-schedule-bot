import { inject, injectable } from "inversify";

import { TYPES } from "../config/types.const";
import { Cabinet } from "../modules/cabinet";
import {
  IScheduleRepository,
  Lesson,
  Schedule,
  ScheduleEntity,
} from "../modules/core";
import { DateService } from "../modules/core/services/date.service";
import { Group } from "../modules/group";
import { IHTTPClient } from "../modules/http";
import { Teacher } from "../modules/teacher";

interface IScheduleResponse {
  date: string;
  lessons: Array<{
    num: string;
    title: string;
    teachername: string;
    cab: string;
    nameGroup?: string;
  }>;
}

@injectable()
export class HTTPScheduleRepository implements IScheduleRepository {
  constructor(
    @inject(TYPES.ScheduleApiUrl) private scheduleApiUrl: string,
    @inject(TYPES.HTTPClient) private httpClient: IHTTPClient,
    @inject(TYPES.DateService) private dateService: DateService,
  ) {}

  public async getSchedule(entity: ScheduleEntity, date = new Date()) {
    let url: string | undefined;

    if (entity instanceof Group) {
      url = this.getUrlForGroup(entity, date);
    }

    if (entity instanceof Teacher) {
      url = this.getUrlForTeacher(entity, date);
    }

    if (entity instanceof Cabinet) {
      url = this.getUrlForCabinet(entity, date);
    }

    if (!url) {
      throw new Error("Unknown ScheduleEntity");
    }

    return this.fetchSchedule(url);
  }

  private async fetchSchedule(url: string) {
    return this.httpClient
      .get<IScheduleResponse>(url)
      .then((r) => this.toSchedule(r));
  }

  private getUrlForGroup(group: Group, date: Date) {
    return `${this.scheduleApiUrl}/${group.id}/${this.formatDate(date)}`;
  }

  private getUrlForTeacher(teacher: Teacher, date: Date) {
    return `${this.scheduleApiUrl}/teacher/${this.formatDate(date)}/${
      teacher.id
    }`;
  }

  private getUrlForCabinet(cabinet: Cabinet, date: Date) {
    return `${this.scheduleApiUrl}/cabs/${this.formatDate(date)}/cabNum/${
      cabinet.id
    }`;
  }

  private formatDate(date: Date) {
    return this.dateService.formatDate(date);
  }

  private toSchedule(obj: IScheduleResponse) {
    return new Schedule(
      obj.date,
      obj.lessons.map((l) => new Lesson(l.num, l.title, l.teachername, l.cab)),
    );
  }
}
