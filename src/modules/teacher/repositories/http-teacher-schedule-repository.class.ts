import {
  IScheduleRepository,
  Lesson,
  Schedule,
  ScheduleEntity,
} from "../../core";
import { DateService } from "../../core/services/date.service";
import { IHTTPClient } from "../../http";
import { Teacher } from "../models/teacher.class";

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

abstract class HTTPScheduleRepository<T extends ScheduleEntity = ScheduleEntity>
  implements IScheduleRepository
{
  constructor(private httpClient: IHTTPClient) {}

  abstract getScheduleUrl(entity: T, date: Date): string;

  public async getSchedule(entity: T, date: Date) {
    return this.httpClient
      .get<IScheduleResponse>(this.getScheduleUrl(entity, date))
      .then((r) => this.toSchedule(r));
  }

  private toSchedule(obj: IScheduleResponse) {
    return new Schedule(
      obj.date,
      obj.lessons.map(
        (l) => new Lesson(l.num, l.title, l.teachername, l.cab, l.nameGroup),
      ),
    );
  }
}

export class HTTPTeacherRepository extends HTTPScheduleRepository {
  constructor(
    private dateService: DateService,
    private scheduleApiUrl: string,

    httpClient: IHTTPClient,
  ) {
    super(httpClient);
  }

  public getScheduleUrl(teacher: Teacher, date: Date) {
    return `${this.scheduleApiUrl}/teacher/${this.formatDate(date)}/${
      teacher.id
    }`;
  }

  private formatDate(date: Date) {
    return this.dateService.formatDate(date);
  }
}
