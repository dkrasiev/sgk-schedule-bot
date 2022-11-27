import axios from "axios";

import logger from "../helpers/logger";
import { config } from "../config";
import { groupsCollection } from "../db";
import { Group, MyContext, Schedule } from "../interfaces";
import { cachePromise } from "../helpers/cache-promise";
import { Api } from "../interfaces/api";
import dayjs from "dayjs";

export class GroupService implements Api<Group, MyContext> {
  private groupRegex = new RegExp(/([А-я]{1,3})[\W]?(\d{2})[\W]?(\d{2})/);

  constructor(private groupApi: string, private scheduleApi: string) {}

  /**
   * Get schedule for the group
   * @param {number} id Group id
   * @param {Dayjs} date Date for schedule
   * @returns {Schedule} Schedule
   */
  public async getSchedule(id: number, date = dayjs()): Promise<Schedule> {
    const url = this.getScheduleUrl(id, date);
    const response = await axios.get<Schedule>(url);

    return response.data;
  }

  /**
   * Get many schedules for groups
   * @param {number[]} ids Group ids
   * @param {Dayjs} date Date for schedule
   * @returns {Promise<Map<number, Schedule>>} Map with group id as key and schedule as value
   */
  public async getManySchedules(
    ids: number[],
    date = dayjs()
  ): Promise<Map<number, Schedule>> {
    ids = Array.from(new Set(ids));

    const promises = ids.map((id) =>
      axios.get<Schedule>(this.getScheduleUrl(id, date))
    );

    const schedules = new Map<number, Schedule>();
    const responses = await axios.all(promises);
    const pattern = /schedule\/(.*)\//;

    for (const response of responses) {
      if (!response.config || !response.config.url) continue;

      const match = response.config.url.match(pattern);
      if (match == null) continue;

      const groupId = Number(match[1]);
      schedules.set(groupId, response.data);
    }

    return schedules;
  }

  /**
   * Get group from bot context
   * @param {MyContext} ctx Bot context
   * @returns {Promise<Group | undefined>} Group or undefined
   */
  public async findInContext(ctx: MyContext) {
    const group =
      (ctx.message?.text && this.findInText(ctx.message.text)) ||
      this.findById(ctx.session.defaultGroup);

    return group;
  }

  /**
   * Get all groups as map
   * @returns {Promise<Map<number, string>>} Map with group id as a key and group name as a property
   */
  public async getAllGroupsAsMap(): Promise<Map<number, string>> {
    const result = new Map();

    const groups = await this.getAll();
    for (const group of groups) {
      result.set(group.id, group.name);
    }

    return result;
  }

  /**
   * Get group by id
   * @param {number} id Group id
   * @returns {Group | undefined} Group
   */
  public async findById(id: number): Promise<Group | undefined> {
    const groups = await this.getAll();
    return groups.find((group: Group) => group.id === id);
  }

  /**
   * Get group by name
   * @param {string} name Group name. Example group name - ИС-19-04
   * @returns {Group | undefined} Group
   */
  public async findByName(name: string): Promise<Group | undefined> {
    const groups = await this.getAll();
    return groups.find((group: Group) => group.name === name);
  }

  /**
   * Get group from text
   * @param {string} text String to search in
   * @returns {Group | undefined} Group
   */
  public async findInText(text: string) {
    const regexResult = this.groupRegex.exec(text);

    if (regexResult == null) {
      return undefined;
    }

    const groupName = regexResult.slice(1).join("-").toUpperCase();
    const group = await this.findByName(groupName);

    return group;
  }

  /**
   * Get all groups with caching
   * @returns {Promise<Group[]>} Array of groups
   */
  public getAll = cachePromise<Group[]>(
    axios
      .get<Group[]>(this.groupApi)
      .then((response) => {
        const groups = response.data;

        groups.forEach((group) => {
          groupsCollection.updateOne(
            { id: group.id },
            { $set: group },
            { upsert: true }
          );
        });

        return groups;
      })
      .catch((e) => {
        logger.error("Failed to get groups", e);

        return groupsCollection.find().toArray();
      })
  );

  /**
   * Get schedule url
   * @param {number} id Group id
   * @param {Dayjs} date Date
   * @returns {string} URL
   */
  private getScheduleUrl(id: number, date = dayjs()): string {
    const formatedDate = date.format("YYYY-MM-DD");
    return [this.scheduleApi, id, formatedDate].join("/");
  }
}

export const groupService = new GroupService(
  config.groupsApi,
  config.scheduleApi
);
