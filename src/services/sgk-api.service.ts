import { Cabinet } from '@modules/cabinet'
import { redisCache } from '@modules/common'
import { ScheduleEntity } from '@modules/domain'

import { myAxios } from '../config/axios'
import { CABINETS_URL, GROUPS_URL, TEACHERS_URL } from '../config/config'

export class SGKApiService {
  @redisCache({
    prefix: 'groups',
  })
  public async fetchGroups(): Promise<ScheduleEntity[]> {
    return myAxios
      .get<{ id: number; name: string }[]>(GROUPS_URL)
      .then((response) =>
        response.data.map(({ id, name }) => ({ id: String(id), name })),
      )
  }

  @redisCache({
    prefix: 'teachers',
  })
  public async fetchTeachers(): Promise<ScheduleEntity[]> {
    return myAxios
      .get<{ id: string; name: string }[]>(TEACHERS_URL)
      .then((response) => response.data.map(({ id, name }) => ({ id, name })))
  }

  @redisCache({
    prefix: 'cabinets',
  })
  public async fetchCabinets(): Promise<ScheduleEntity[]> {
    return myAxios
      .get<{ [key: string]: string }>(CABINETS_URL)
      .then((response) =>
        Object.entries(response.data).map(
          ([id, name]) => new Cabinet(id, name),
        ),
      )
  }
}
