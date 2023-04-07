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

  public async init() {
    this._groups = await sgkApi
      .getGroups()
      .then((groups) => groups.sort((a, b) => a.name.localeCompare(b.name)))
      .then((groups) => groups.sort((a, b) => a.name.length - b.name.length));

    // filter Администратор, Вакансия, Резерв, методист, методист1
    this._teachers = await sgkApi
      .getTeachers()
      .then((teachers) =>
        teachers.filter((teacher) => teacher.name.split(" ").length > 2)
      )
      .then((teachers) =>
        teachers.sort((a, b) => a.name.localeCompare(b.name))
      );

    // filter п/п, дист/дист
    this._cabinets = await sgkApi
      .getCabinets()
      .then((cabinets) =>
        cabinets.filter(
          (cabinet) => cabinet.name !== "п/п" && cabinet.name !== "дист/дист"
        )
      )
      .then((cabinets) =>
        cabinets.sort((a, b) => a.name.localeCompare(b.name))
      );
  }

  public searchInContext(ctx: MyContext): ScheduleEntity[] {
    const query = (ctx.message?.text && trimCommand(ctx.message.text)) || "";
    if (query) {
      const searchByNameResult = this.searchByName(query);
      if (searchByNameResult.length) {
        return searchByNameResult;
      }
    }

    const defaultEntity = ctx.getDefault();
    if (defaultEntity) {
      return [defaultEntity];
    }

    return [];
  }

  public searchByName(query: string): ScheduleEntity[] {
    const args: string[] = getArguments(query);

    return this.all.filter((entity) => {
      const nameArgs: string[] = getArguments(entity.name);

      if (entity instanceof Group) {
        // return args.every((arg) =>
        //   nameArgs.some((nameArg) => nameArg.includes(arg))
        // );
      }

      return args.every((arg) =>
        nameArgs.some((nameArg) => nameArg.includes(arg))
      );
    });
  }

  public searchById(id: string) {
    return this.all.filter((entity) => entity.id === id);
  }

  public findById(id: string) {
    return this.all.find((entity) => entity.id === id);
  }
}

export const finder = new FinderService();
