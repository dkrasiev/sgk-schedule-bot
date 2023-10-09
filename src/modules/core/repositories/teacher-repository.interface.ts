import { Teacher } from "../models/teacher.class";
import { IScheduleEntityRepository } from "../repositories/schedule-entity-repository.interface";

export interface ITeacherRepository
  extends IScheduleEntityRepository<Teacher> {}
