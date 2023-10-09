import { IScheduleEntityFactory } from "../../core";
import { Cabinet } from "../models/cabinet.class";

export class CabinetFactory implements IScheduleEntityFactory<Cabinet> {
  public createEntity(id: string, name: string) {
    return new Cabinet(id, name);
  }
}
