import { Cabinet } from "../models/cabinet.class";
import { IScheduleEntityRepository } from "../repositories/schedule-entity-repository.interface";

export interface ICabinetRepository
  extends IScheduleEntityRepository<Cabinet> {}
