import "reflect-metadata";

import axios from "axios";
import { Container } from "inversify";

import {
  Cabinet,
  CabinetFactory,
  HTTPCabinetRepository,
} from "../modules/cabinet";
import {
  IDateRepository,
  IScheduleEntityFactory,
  IScheduleEntityRepository,
  IScheduleRepository,
  ISearchRepository,
  ScheduleEntity,
  ScheduleEntityService,
  ScheduleService,
} from "../modules/core";
import { DateService } from "../modules/core/services/date.service";
import { Group, GroupFactory, HTTPGroupRepository } from "../modules/group";
import { IHTTPClient } from "../modules/http";
import {
  HTTPTeacherRepository,
  Teacher,
  TeacherFactory,
} from "../modules/teacher";
import { AxiosHTTPClient } from "../repositories/axios-http-client.class";
import { DayjsDateRepository } from "../repositories/dayjs-date-repository.class";
import { HTTPScheduleRepository } from "../repositories/http-schedule-repository.class";
import { FlexSearchRepository } from "../repositories/index-search-repository.class";
import { LocalCacheScheduleEntityRepository } from "../repositories/local-cache-schedule-entity-repository.class";
import { ScheduleEntityRepository } from "../repositories/schedule-entity-repository.class";
import config from "./config";
import { TYPES } from "./types.const";

export class DIContainerService {
  constructor(public container = new Container()) {}

  public setup() {
    this.container
      .bind<axios.AxiosInstance>(TYPES.Axios)
      .toConstantValue(axios.create());
    this.container.bind<IHTTPClient>(TYPES.HTTPClient).to(AxiosHTTPClient);

    this.configureGroups();
    this.configureTeacher();
    this.configureCabinet();

    this.container
      .bind<string>(TYPES.ScheduleApiUrl)
      .toConstantValue(config.SCHEDULE_URL);

    this.container
      .bind<string>(TYPES.DateFormat)
      .toConstantValue(config.DATE_FORMAT);

    this.container
      .bind<IDateRepository>(TYPES.DateRepository)
      .to(DayjsDateRepository);

    this.container
      .bind<IScheduleEntityRepository>(TYPES.MainScheduleEntityRepository)
      .toDynamicValue(
        (ctx) =>
          new LocalCacheScheduleEntityRepository(
            new ScheduleEntityRepository(
              ctx.container.getAll<IScheduleEntityRepository>(
                TYPES.ScheduleEntityRepository,
              ),
            ),
          ),
      );
    this.container
      .bind<ISearchRepository>(TYPES.SearchRepository)
      .to(FlexSearchRepository);
    this.container
      .bind<IScheduleRepository>(TYPES.ScheduleRepository)
      .to(HTTPScheduleRepository);

    this.container
      .bind<ScheduleService>(ScheduleService)
      .toDynamicValue(
        (ctx) =>
          new ScheduleService(
            ctx.container.get<IScheduleRepository>(TYPES.ScheduleRepository),
            ctx.container.get<IDateRepository>(TYPES.DateRepository),
          ),
      );

    this.container
      .bind(ScheduleEntityService)
      .toDynamicValue(
        (ctx) =>
          new ScheduleEntityService(
            ctx.container.get<IScheduleEntityRepository>(
              TYPES.ScheduleEntityRepository,
            ),
            ctx.container.get<ISearchRepository<ScheduleEntity>>(
              TYPES.SearchRepository,
            ),
          ),
      );
    this.container
      .bind(DateService)
      .toDynamicValue(
        (ctx) =>
          new DateService(
            ctx.container.get<IDateRepository>(TYPES.DateRepository),
          ),
      );
  }

  private configureGroups() {
    this.container
      .bind<string>(TYPES.GroupApiUrl)
      .toConstantValue(config.GROUPS_URL);
    this.container
      .bind<IScheduleEntityFactory<Group>>(TYPES.GroupFactory)
      .toDynamicValue(() => new GroupFactory());
    this.container
      .bind<IScheduleEntityRepository<Group>>(TYPES.ScheduleEntityRepository)
      .toDynamicValue(
        (ctx) =>
          new HTTPGroupRepository(
            ctx.container.get<IHTTPClient>(TYPES.HTTPClient),
            ctx.container.get<IScheduleEntityFactory<Group>>(
              TYPES.GroupFactory,
            ),
            ctx.container.get<string>(TYPES.GroupApiUrl),
          ),
      );
  }

  private configureTeacher() {
    this.container
      .bind<string>(TYPES.TeacherApiUrl)
      .toConstantValue(config.TEACHERS_URL);
    this.container
      .bind<IScheduleEntityFactory<Teacher>>(TYPES.TeacherFactory)
      .toDynamicValue(() => new TeacherFactory());
    this.container
      .bind<IScheduleEntityRepository<Cabinet>>(TYPES.ScheduleEntityRepository)
      .toDynamicValue(
        (ctx) =>
          new HTTPTeacherRepository(
            ctx.container.get<IHTTPClient>(TYPES.HTTPClient),
            ctx.container.get<IScheduleEntityFactory<Teacher>>(
              TYPES.TeacherFactory,
            ),
            ctx.container.get<string>(TYPES.TeacherApiUrl),
          ),
      );
  }

  private configureCabinet() {
    this.container
      .bind<string>(TYPES.CabinetApiUrl)
      .toConstantValue(config.CABINETS_URL);
    this.container
      .bind<IScheduleEntityFactory<Cabinet>>(TYPES.CabinetFactory)
      .toDynamicValue(() => new CabinetFactory());
    this.container
      .bind<IScheduleEntityRepository<Cabinet>>(TYPES.ScheduleEntityRepository)
      .toDynamicValue(
        (ctx) =>
          new HTTPCabinetRepository(
            ctx.container.get<IHTTPClient>(TYPES.HTTPClient),
            ctx.container.get<IScheduleEntityFactory<Cabinet>>(
              TYPES.CabinetFactory,
            ),
            ctx.container.get<string>(TYPES.CabinetApiUrl),
          ),
      );
  }
}

export const diContainerService = new DIContainerService();
