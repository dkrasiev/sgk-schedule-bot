import { AxiosInstance } from "axios";
import { inject, injectable } from "inversify";

import { TYPES } from "../config/types.const";
import { Group } from "../modules/core";
import { BaseScheduleEntityRepository } from "./base-schedule-entity-repository.class";

@injectable()
export class HTTPGroupRepository extends BaseScheduleEntityRepository<Group> {
  constructor(
    @inject(TYPES.Axios) private axios: AxiosInstance,
    @inject(TYPES.GroupApiUrl) private readonly groupApiUrl: string,
  ) {
    super();
  }

  public async getAll() {
    return this.axios
      .get<Array<{ id: number; name: string }>>(this.groupApiUrl)
      .then((r) => r.data)
      .then((d) => d.map(({ id, name }) => new Group(String(id), name)));
  }
}
