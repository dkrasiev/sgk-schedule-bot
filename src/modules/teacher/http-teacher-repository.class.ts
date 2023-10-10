import { IScheduleEntityFactory } from '../common'
import { IScheduleEntityRepository } from '../core'
import { IHTTPClient } from '../http'
import { Teacher } from './teacher.class'

export class HTTPTeacherRepository
  implements IScheduleEntityRepository<Teacher>
{
  constructor(
    private httpClient: IHTTPClient,
    private teacherFactory: IScheduleEntityFactory<Teacher>,
    private teacherApiUrl: string,
  ) {}

  public async getAll() {
    return this.httpClient
      .get<Array<{ id: string; name: string }>>(this.teacherApiUrl)
      .then((data) =>
        data.map(({ id, name }) => this.teacherFactory.createEntity(id, name)),
      )
  }

  public async getById(id: string) {
    return this.getAll().then((entities) => entities.find((e) => e.id === id))
  }
}
