import { inject, injectable } from "inversify";

import { Group, IGroupRepository } from "../modules/core";
import { BaseScheduleEntityRepository } from "./base-schedule-entity-repository.class";
import { RestApiGroupRepository } from "./http-teacher-repository.class";

@injectable()
export class LocalCacheRestApiGroupRepository extends BaseScheduleEntityRepository<Group> {
  private groups: Group[] = [];

  constructor(
    @inject(RestApiGroupRepository) private groupRepository: IGroupRepository,
  ) {
    super();
  }

  public async getAll(): Promise<Group[]> {
    if (this.groups.length > 0) {
      return this.groups;
    }

    return this.groupRepository
      .getAll()
      .then((groups) => (this.groups = groups));
  }
}
