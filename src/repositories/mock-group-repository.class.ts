import { injectable } from "inversify";

import { Group } from "../modules/core";
import { BaseScheduleEntityRepository } from "./base-schedule-entity-repository.class";

@injectable()
export class MockGroupRepository extends BaseScheduleEntityRepository<Group> {
  private groups = new Array(100)
    .fill(null)
    .map((_v, i) => String(i))
    .map((v) => new Group(v, v));

  public async getAll() {
    return this.groups;
  }
}
