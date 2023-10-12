import { AbstractScheduleEntityRepository } from '@modules/application'
import { IHTTPClient } from '@modules/http'

import { Group } from './group.class'
import { GroupFactory } from './group-factory.class'

export class HTTPGroupRepository extends AbstractScheduleEntityRepository {
  constructor(
    private httpClient: IHTTPClient,
    private groupApiUrl: string,
  ) {
    super(new GroupFactory())
  }

  protected async fetch(): Promise<Group[]> {
    return this.httpClient
      .get<Array<{ id: number; name: string }>>(this.groupApiUrl)
      .then((data) => data.map(({ id, name }) => ({ id: String(id), name })))
  }
}
