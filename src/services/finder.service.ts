import { Cabinet } from "../models/cabinet.class";
import { Group } from "../models/group.class";
import { MyContext } from "../models/my-context.type";
import { ScheduleEntity } from "../models/schedule-entity.class";
import { Teacher } from "../models/teacher.class";
import { getArgument } from "../utils/get-argument";
import { sgkApi } from "./sgk-api.service";

export class FinderService {
  private groups: Group[] = [];
  private teachers: Teacher[] = [];
  private cabinets: Cabinet[] = [];

  public get all(): Readonly<ScheduleEntity[]> {
    return [...this.groups, ...this.teachers, ...this.cabinets];
  }

  public getGroups(): Readonly<Group[]> {
    return this.groups;
  }

  public getTeachers(): Readonly<Teacher[]> {
    return this.teachers;
  }

  public getCabinets(): Readonly<Cabinet[]> {
    return this.cabinets;
  }

  public async init() {
    this.groups = await sgkApi.getGroups();
    this.teachers = await sgkApi.getTeachers();
    this.cabinets = await sgkApi.getCabinets();
  }

  public searchFromContext(ctx: MyContext): ScheduleEntity[] {
    const query = getArgument(ctx.message?.text || "");
    if (query) {
      return this.searchByName(query);
    }

    const defaultEntity = ctx.getDefault();
    if (defaultEntity) {
      return [defaultEntity];
    }

    return [];
  }

  public searchByName(query: string): ScheduleEntity[] {
    if (!query) return [];

    return this.all.filter((entity) =>
      entity.name.replace(/-/g, "").toLowerCase().includes(query)
    );
  }

  public searchById(id: string) {
    return [...this.groups, ...this.teachers].filter(
      (entity) => entity.id === id
    );
  }

  public findById(id: string) {
    return this.all.find((entity) => entity.id === id);
  }
}

export const finder = new FinderService();
