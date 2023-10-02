import { AxiosInstance } from "axios";
import { inject, injectable } from "inversify";

import { TYPES } from "../config/types.const";
import { Cabinet } from "../modules/core";
import { BaseScheduleEntityRepository } from "./base-schedule-entity-repository.class";

@injectable()
export class HTTPCabinetRepository extends BaseScheduleEntityRepository<Cabinet> {
  constructor(
    @inject(TYPES.Axios) private axios: AxiosInstance,
    @inject(TYPES.CabinetApiUrl) private readonly cabinetApiUrl: string,
  ) {
    super();
  }

  public async getAll() {
    return this.axios
      .get<Record<string, string>>(this.cabinetApiUrl)
      .then((r) => r.data)
      .then((d) => Object.entries(d))
      .then((e) => e.map(([id, name]) => new Cabinet(id, name)));
  }
}
