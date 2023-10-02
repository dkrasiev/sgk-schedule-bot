import "reflect-metadata";

import axios from "axios";
import { Container } from "inversify";

import {
  ICabinetRepository,
  IGroupRepository,
  IScheduleEntityRepository,
  IScheduleRepository,
  ISearchRepository,
  ITeacherRepository,
  ScheduleEntity,
  ScheduleEntityService,
  ScheduleService,
} from "../modules/core";
import { HTTPCabinetRepository } from "../repositories/http-cabinet-repository.class";
import { HTTPGroupRepository } from "../repositories/http-group-repository.class";
import { HTTPTeacherRepository } from "../repositories/http-teacher-repository.class";
import { ScheduleEntityRepository } from "../repositories/schedule-entity-repository.class";
import { ScheduleRepository } from "../repositories/schedule-repository.class";
import { SearchRepository } from "../repositories/search-repository.class";
import config from "./config";
import { TYPES } from "./types.const";

export const container = new Container();

container
  .bind<axios.AxiosInstance>(TYPES.Axios)
  .toConstantValue(axios.create());

container.bind<string>(TYPES.GroupApiUrl).toConstantValue(config.GROUPS_URL);
container
  .bind<string>(TYPES.TeacherApiUrl)
  .toConstantValue(config.TEACHERS_URL);
container
  .bind<string>(TYPES.CabinetApiUrl)
  .toConstantValue(config.CABINETS_URL);
container
  .bind<string>(TYPES.ScheduleApiUrl)
  .toConstantValue(config.SCHEDULE_URL);
container.bind<string>(TYPES.DateFormat).toConstantValue(config.DATE_FORMAT);

container.bind<IGroupRepository>(TYPES.GroupRepository).to(HTTPGroupRepository);
container
  .bind<ITeacherRepository>(TYPES.TeacherRepository)
  .to(HTTPTeacherRepository);
container
  .bind<ICabinetRepository>(TYPES.CabinetRepository)
  .to(HTTPCabinetRepository);

container
  .bind<IScheduleEntityRepository>(TYPES.ScheduleEntityRepository)
  .to(ScheduleEntityRepository);
container.bind<ISearchRepository>(TYPES.SearchRepository).to(SearchRepository);
container
  .bind<IScheduleRepository>(TYPES.ScheduleRepository)
  .to(ScheduleRepository);

container
  .bind<ScheduleService>(ScheduleService)
  .toDynamicValue(
    (ctx) =>
      new ScheduleService(
        ctx.container.get<IScheduleRepository>(TYPES.ScheduleRepository),
      ),
  );

container
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
