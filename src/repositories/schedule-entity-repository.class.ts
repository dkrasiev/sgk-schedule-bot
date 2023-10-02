import { inject, injectable } from "inversify";

import { TYPES } from "../config/types.const";
import {
  ICabinetRepository,
  IGroupRepository,
  ITeacherRepository,
  ScheduleEntity,
} from "../modules/core";
import { BaseScheduleEntityRepository } from "./base-schedule-entity-repository.class";

@injectable()
export class ScheduleEntityRepository extends BaseScheduleEntityRepository {
  private entities: ScheduleEntity[] = [];

  constructor(
    @inject(TYPES.GroupRepository) private groupRepository: IGroupRepository,
    @inject(TYPES.TeacherRepository)
    private teacherRepository: ITeacherRepository,
    @inject(TYPES.CabinetRepository)
    private cabinetRepository: ICabinetRepository,
  ) {
    super();
  }

  public async getAll() {
    return this.entities.length > 0
      ? this.entities
      : Promise.all([
          this.groupRepository.getAll(),
          this.teacherRepository.getAll(),
          this.cabinetRepository.getAll(),
        ])
          .then((result) => result.flat() as ScheduleEntity[])
          .then((entities) => (this.entities = entities));
  }
}
