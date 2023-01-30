import axios from "../axios";
import logger from "../helpers/logger";
import { config } from "../config";
import { Group } from "../models/group.interface";
import { MyContext } from "../models/my-context.type";
import { cachePromise } from "../helpers/cache-promise";
import { Api } from "../models/api";
import { groups } from "../database";

export class GroupService implements Api<Group, MyContext> {
  private groupRegex = new RegExp(/([А-я]{1,3})[\W]?(\d{2})[\W]?(\d{2})/);

  constructor(private groupApi: string) {}

  public async findInContext(ctx: MyContext) {
    const group =
      (ctx.message?.text && this.findInText(ctx.message.text)) ||
      this.findById(ctx.session.defaultGroup);

    return group;
  }

  public async getAllGroupsAsMap(): Promise<Map<number, string>> {
    const result = new Map();

    const groups = await this.getAll();
    for (const group of groups) {
      result.set(group.id, group.name);
    }

    return result;
  }

  public async findById(id: number): Promise<Group | undefined> {
    const groups = await this.getAll();
    return groups.find((group: Group) => group.id === id);
  }

  public async findByName(name: string): Promise<Group | undefined> {
    const groups = await this.getAll();
    return groups.find((group: Group) => group.name === name);
  }

  public async findInText(text: string): Promise<Group | undefined> {
    const regexResult = this.groupRegex.exec(text);

    if (regexResult == null) {
      return undefined;
    }

    const groupName = regexResult.slice(1).join("-").toUpperCase();
    const group = await this.findByName(groupName);

    return group;
  }

  public getAll = cachePromise<Group[]>(
    axios
      .get<Group[]>(this.groupApi)
      .then(({ data }): Group[] => {
        const result: Group[] = data
          .sort((a, b) => a.name.localeCompare(b.name))
          // remove group with name "--"
          .slice(1);

        result.forEach((group) =>
          groups.updateOne({ id: group.id }, { $set: group }, { upsert: true })
        );

        return result;
      })
      .catch((e) => {
        logger.error("Failed to get groups", e);

        return groups.find().toArray();
      })
  );

  public async findMany(query: string): Promise<Group[]> {
    const groups: Group[] = await this.getAll();

    return groups.filter(({ name }) => this.search(name, query));
  }

  private search(first: string, second: string): boolean {
    first = first.toLowerCase().trim();
    second = second.toLowerCase().trim();

    return first.includes(second);
  }
}

export const groupService = new GroupService(config.api.groups);
