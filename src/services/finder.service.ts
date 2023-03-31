import { Cabinet } from "../models/cabinet.class";
import { Group } from "../models/group.class";
import { MyContext } from "../models/my-context.type";
import { ScheduleEntity } from "../models/schedule-entity.class";
import { Teacher } from "../models/teacher.class";
import { getArguments } from "../utils/get-arguments";
import { trimCommand } from "../utils/trim-command";
import { sgkApi } from "./sgk-api.service";

export class FinderService {
  private _groups: Group[] = [];
  private _teachers: Teacher[] = [];
  private _cabinets: Cabinet[] = [];

  public get all(): Readonly<ScheduleEntity[]> {
    return [...this._groups, ...this._teachers, ...this._cabinets];
  }

  // TODO: три нижних геттера вроде не используются
  public get groups(): Readonly<Group[]> {
    return this._groups;
  }

  public get teachers(): Readonly<Teacher[]> {
    return this._teachers;
  }

  public get cabinets(): Readonly<Cabinet[]> {
    return this._cabinets;
  }

  public async init() {
    this._groups = await sgkApi.getGroups();

    // filter Администратор, Вакансия, Резерв, методист, методист1
    this._teachers = (await sgkApi.getTeachers()).filter(
      (teacher) => teacher.name.split(" ").length > 2
    );

    // filter п/п, дист/дист
    this._cabinets = (await sgkApi.getCabinets()).filter(
      (cabinet) => cabinet.name !== "п/п" && cabinet.name !== "дист/дист"
    );
  }

  public searchInContext(ctx: MyContext): ScheduleEntity[] {
    const query = trimCommand(ctx.message?.text || "");
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
    const args: string[] = getArguments(query);

    return this.all.filter(({ name }) =>
      args.every((arg) => name.replace(/-/g, "").toLowerCase().includes(arg))
    );
  }

  public searchById(id: string) {
    return this.all.filter((entity) => entity.id === id);
  }

  public findById(id: string) {
    return this.all.find((entity) => entity.id === id);
  }
}

export const finder = new FinderService();
