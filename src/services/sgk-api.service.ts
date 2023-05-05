import myAxios from "../axios";
import { CABINETS_URL, GROUPS_URL, TEACHERS_URL } from "../config";
import { IScheduleEntity } from "../models/entities/schedule-entity.interface";
import redisCache from "../utils/redis-cache";

export class SGKApiService {
  @redisCache({
    prefix: "groups",
  })
  public async fetchGroups(): Promise<IScheduleEntity[]> {
    return myAxios
      .get<{ id: number; name: string }[]>(GROUPS_URL)
      .then((response) =>
        response.data.map(({ id, name }) => ({ id: String(id), name }))
      );
  }

  @redisCache({
    prefix: "teachers",
  })
  public async fetchTeachers(): Promise<IScheduleEntity[]> {
    return myAxios
      .get<{ id: string; name: string }[]>(TEACHERS_URL)
      .then((response) => response.data.map(({ id, name }) => ({ id, name })));
  }

  @redisCache({
    prefix: "cabinets",
  })
  public async fetchCabinets(): Promise<IScheduleEntity[]> {
    return myAxios
      .get<{ [key: string]: string }>(CABINETS_URL)
      .then((response) =>
        Object.entries(response.data).map(([id, name]) => ({ id, name }))
      );
  }
}
