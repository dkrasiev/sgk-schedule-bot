import { IScheduleEntityFactory } from "../../core";
import { Group } from "../models/group.class";

export class GroupFactory implements IScheduleEntityFactory<Group> {
  public createEntity(id: string, name: string) {
    return new Group(id, name);
  }
}
