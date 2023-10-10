import 'reflect-metadata'

import axios from 'axios'
import { Container } from 'inversify'

import {
  Cabinet,
  CabinetFactory,
  HTTPCabinetRepository,
  HTTPCabinetScheduleRepository,
} from '../modules/cabinet'
import { IScheduleEntityFactory } from '../modules/common'
import {
  IScheduleEntityRepository,
  IScheduleRepository,
  ISearchRepository,
} from '../modules/core'
import {
  Group,
  GroupFactory,
  HTTPGroupRepository,
  HTTPGroupScheduleRepository,
} from '../modules/group'
import { IHTTPClient } from '../modules/http'
import {
  HTTPTeacherRepository,
  HTTPTeacherScheduleRepository,
  Teacher,
  TeacherFactory,
} from '../modules/teacher'
import { AxiosHTTPClient } from '../repositories/axios-http-client.class'
import { HTTPScheduleRepository } from '../repositories/http-schedule-repository.class'
import { LocalCacheScheduleEntityRepository } from '../repositories/local-cache-schedule-entity-repository.class'
import { ScheduleEntityRepository } from '../repositories/schedule-entity-repository.class'
import { SimpleSearchRepository } from '../repositories/simple-search-repository.class'
import config from './config'
import { TYPES } from './types.const'

export class DIContainerService {
  constructor(public container = new Container()) {}

  public setup() {
    this.container
      .bind<axios.AxiosInstance>(TYPES.Axios)
      .toConstantValue(axios.create())

    this.container.bind<IHTTPClient>(TYPES.HTTPClient).to(AxiosHTTPClient)

    this.container
      .bind<string>(TYPES.ScheduleApiUrl)
      .toConstantValue(config.SCHEDULE_URL)

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
      .to(SimpleSearchRepository)
    this.container
      .bind<IScheduleRepository>(TYPES.ScheduleRepository)
      .to(HTTPScheduleRepository)
  }

  public setupGroup() {
    const scheduleApiUrl = this.container.get<string>(TYPES.ScheduleApiUrl)
    const httpClient = this.container.get<IHTTPClient>(TYPES.HTTPClient)
    const groupApiUrl = config.GROUPS_URL

    const groupFactory = new GroupFactory()

    this.container
      .bind<IScheduleEntityFactory<Group>>(TYPES.GroupFactory)
      .toConstantValue(groupFactory)

    this.container.bind<string>(TYPES.GroupApiUrl).toConstantValue(groupApiUrl)

    this.container
      .bind<IScheduleEntityRepository<Group>>(TYPES.ScheduleEntityRepository)
      .toConstantValue(
        new HTTPGroupRepository(httpClient, groupFactory, groupApiUrl),
      )

    this.container
      .bind<IScheduleRepository>(TYPES.GroupScheduleRepository)
      .toConstantValue(
        new HTTPGroupScheduleRepository(scheduleApiUrl, httpClient),
      )
  }

  public setupTeacher() {
    const scheduleApiUrl = this.container.get<string>(TYPES.ScheduleApiUrl)
    const httpClient = this.container.get<IHTTPClient>(TYPES.HTTPClient)
    const teacherApiUrl = config.TEACHERS_URL

    const teacherFactory = new TeacherFactory()

    this.container
      .bind<IScheduleEntityFactory<Teacher>>(TYPES.TeacherFactory)
      .toConstantValue(teacherFactory)

    this.container
      .bind<string>(TYPES.TeacherApiUrl)
      .toConstantValue(teacherApiUrl)

    this.container
      .bind<IScheduleEntityRepository<Teacher>>(TYPES.ScheduleEntityRepository)
      .toConstantValue(
        new HTTPTeacherRepository(httpClient, teacherFactory, teacherApiUrl),
      )

    this.container
      .bind<IScheduleRepository>(TYPES.TeacherScheduleRepository)
      .toConstantValue(
        new HTTPTeacherScheduleRepository(scheduleApiUrl, httpClient),
      )
  }
  public setupCabinet() {
    const scheduleApiUrl = this.container.get<string>(TYPES.ScheduleApiUrl)
    const httpClient = this.container.get<IHTTPClient>(TYPES.HTTPClient)
    const cabinetApiUrl = config.CABINETS_URL

    const cabinetFactory = new CabinetFactory()

    this.container
      .bind<IScheduleEntityFactory<Cabinet>>(TYPES.CabinetFactory)
      .toConstantValue(cabinetFactory)

    this.container
      .bind<string>(TYPES.CabinetApiUrl)
      .toConstantValue(cabinetApiUrl)

    this.container
      .bind<IScheduleEntityRepository<Cabinet>>(TYPES.ScheduleEntityRepository)
      .toConstantValue(
        new HTTPCabinetRepository(httpClient, cabinetFactory, cabinetApiUrl),
      )

    this.container
      .bind<IScheduleRepository>(TYPES.CabinetScheduleRepository)
      .toConstantValue(
        new HTTPCabinetScheduleRepository(scheduleApiUrl, httpClient),
      )
  }
}

export const diContainerService = new DIContainerService()
