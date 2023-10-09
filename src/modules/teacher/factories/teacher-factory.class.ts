import { IScheduleEntityFactory } from "../../core";
import { Teacher } from "../models/teacher.class";

export class TeacherFactory implements IScheduleEntityFactory<Teacher> {
  public createEntity(id: string, name: string) {
    return new Teacher(id, name);
  }
}
