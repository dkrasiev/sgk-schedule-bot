import { Cabinet } from "../models/entities/cabinet.class";
import { Group } from "../models/entities/group.class";
import { ScheduleEntity } from "../models/entities/schedule-entity.class";
import { Teacher } from "../models/entities/teacher.class";
import { MyContext } from "../models/my-context.type";
import { getArguments } from "../utils/get-arguments";
import { trimCommand } from "../utils/trim-command";
import { SGKApiService } from "./sgk-api.service";

export class FinderService {
  private _groups: Group[] = [];
  private _teachers: Teacher[] = [];
  private _cabinets: Cabinet[] = [];

  constructor(private sgkApiService: SGKApiService) {}

  public get all(): Readonly<ScheduleEntity[]> {
    return [...this._groups, ...this._teachers, ...this._cabinets];
  }

  public async init() {
    this._groups = await this.sgkApiService
      .getGroups()
      .then((entities) =>
        entities.map((entity) => new Group(entity.id, entity.name))
      )
      .then((groups) => groups.sort((a, b) => a.name.localeCompare(b.name)))
      .then((groups) => groups.sort((a, b) => a.name.length - b.name.length));

    // filter Администратор, Вакансия, Резерв, методист, методист1
    this._teachers = await this.sgkApiService
      .getTeachers()
      .then((entities) =>
        entities.map((entity) => new Teacher(entity.id, entity.name))
      )
      .then((teachers) =>
        teachers.filter((teacher) => teacher.name.split(" ").length > 2)
      )
      .then((teachers) =>
        teachers.sort((a, b) => a.name.localeCompare(b.name))
      );

    // filter п/п, дист/дист
    this._cabinets = await this.sgkApiService
      .getCabinets()
      .then((entities) =>
        entities.map((entity) => new Cabinet(entity.id, entity.name))
      )
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

    return this.all.filter((entity) =>
      args.every((arg) =>
        getArguments(entity.name).some((nameArg) => nameArg.includes(arg))
      )
    );
  }

  public searchById(id: string) {
    return this.all.filter((entity) => entity.id === id);
  }

  public findById(id: string) {
    return this.all.find((entity) => entity.id === id);
  }
}
