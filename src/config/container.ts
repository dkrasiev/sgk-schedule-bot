import 'reflect-metadata'

import {
  HTTPScheduleRepository,
  LocalCacheScheduleEntityRepository,
  ScheduleEntityRepository,
  SimpleSearchRepository,
} from '@modules/adapters'
import {
  IScheduleEntityRepository,
  IScheduleRepository,
  ISearchRepository,
} from '@modules/application'
import {
  HTTPCabinetRepository,
  HTTPCabinetScheduleRepository,
} from '@modules/cabinet'
import {
  HTTPGroupRepository,
  HTTPGroupScheduleRepository,
} from '@modules/group'
import { AxiosHTTPClient, IHTTPClient } from '@modules/http'
import {
  HTTPTeacherRepository,
  HTTPTeacherScheduleRepository,
} from '@modules/teacher'
import axios, { AxiosInstance } from 'axios'
import { Container } from 'inversify'

import CONFIG from './config'
import { TYPES } from './types.const'

export class DIContainerService {
  public container
  public config

  constructor({ container = new Container(), config = CONFIG }) {
    this.container = container
    this.config = config
  }

  public setup() {
    this.container
      .bind<axios.AxiosInstance>(TYPES.Axios)
      .toConstantValue(axios.create())
    this.container
      .bind<IHTTPClient>(TYPES.HTTPClient)
      .toDynamicValue(
        (ctx) =>
          new AxiosHTTPClient(ctx.container.get<AxiosInstance>(TYPES.Axios)),
      )
    this.container
      .bind<string>(TYPES.ScheduleApiUrl)
      .toConstantValue(this.config.SCHEDULE_URL)

    this.container.get<IHTTPClient>(TYPES.HTTPClient)

    this.setupGroup()
    this.setupTeacher()
    this.setupCabinet()

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
      )
    this.container
      .bind<ISearchRepository>(TYPES.SearchRepository)
      .toDynamicValue(
        (ctx) =>
          new SimpleSearchRepository(
            ctx.container.get(TYPES.MainScheduleEntityRepository),
          ),
      )
    this.container
      .bind<IScheduleRepository>(TYPES.ScheduleRepository)
      .toDynamicValue(
        (ctx) =>
          new HTTPScheduleRepository(
            ctx.container.get(TYPES.GroupScheduleRepository),
            ctx.container.get(TYPES.TeacherScheduleRepository),
            ctx.container.get(TYPES.CabinetScheduleRepository),
          ),
      )
  }

  private setupGroup() {
    this.container
      .bind<IScheduleEntityRepository>(TYPES.ScheduleEntityRepository)
      .toDynamicValue(
        (ctx) =>
          new HTTPGroupRepository(
            ctx.container.get(TYPES.HTTPClient),
            this.config.GROUPS_URL,
          ),
      )

    this.container
      .bind<IScheduleRepository>(TYPES.GroupScheduleRepository)
      .toDynamicValue(
        (ctx) =>
          new HTTPGroupScheduleRepository(
            ctx.container.get(TYPES.ScheduleApiUrl),
            ctx.container.get(TYPES.HTTPClient),
          ),
      )
  }

  private setupTeacher() {
    this.container
      .bind<IScheduleEntityRepository>(TYPES.ScheduleEntityRepository)
      .toDynamicValue(
        (ctx) =>
          new HTTPTeacherRepository(
            ctx.container.get(TYPES.HTTPClient),
            this.config.TEACHERS_URL,
          ),
      )

    this.container
      .bind<IScheduleRepository>(TYPES.TeacherScheduleRepository)
      .toDynamicValue(
        (ctx) =>
          new HTTPTeacherScheduleRepository(
            ctx.container.get(TYPES.ScheduleApiUrl),
            ctx.container.get(TYPES.HTTPClient),
          ),
      )
  }
  private setupCabinet() {
    this.container
      .bind<IScheduleEntityRepository>(TYPES.ScheduleEntityRepository)
      .toDynamicValue(
        (ctx) =>
          new HTTPCabinetRepository(
            ctx.container.get(TYPES.HTTPClient),
            this.config.CABINETS_URL,
          ),
      )

    this.container
      .bind<IScheduleRepository>(TYPES.CabinetScheduleRepository)
      .toDynamicValue(
        (ctx) =>
          new HTTPCabinetScheduleRepository(
            ctx.container.get(TYPES.ScheduleApiUrl),
            ctx.container.get(TYPES.HTTPClient),
          ),
      )
  }
}

export const diContainerService = new DIContainerService({
  config: CONFIG,
})
