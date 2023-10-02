import { AxiosInstance } from "axios";
import { inject, injectable } from "inversify";

import { TYPES } from "../config/types.const";
import { Teacher } from "../modules/core";
import { BaseScheduleEntityRepository } from "./base-schedule-entity-repository.class";

@injectable()
export class HTTPTeacherRepository extends BaseScheduleEntityRepository<Teacher> {
  constructor(
    @inject(TYPES.Axios) private axios: AxiosInstance,
    @inject(TYPES.TeacherApiUrl) private readonly teacherApiUrl: string,
  ) {
    super();
  }

  public async getAll() {
    return this.axios
      .get<Array<{ id: string; name: string }>>(this.teacherApiUrl)
      .then((r) => r.data)
      .then((d) => d.map(({ id, name }) => new Teacher(id, name)));
  }
}
