import { Dayjs } from "dayjs";
import { Context } from "grammy";
import { Group } from "./group.interface";
import { Schedule } from "./schedule.interface";
import { Teacher } from "./teacher.interface";

export interface Api<T extends Teacher | Group, K extends Context> {
  getAll(): Promise<T[]>;
  findById(id: number | string): Promise<T | undefined>;
  findByName(name: string): Promise<T | undefined>;
  findInText(text: string): Promise<T | undefined>;
  findInContext(ctx: K): Promise<T | undefined>;
  getSchedule(id: number | string, date: Dayjs): Promise<Schedule>;
}
