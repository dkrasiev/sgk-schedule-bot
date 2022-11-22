import axios from "axios";

import logger from "./logger";
import { config } from "../config";
import { groupsCollection } from "../db";
import { Group, MyContext } from "../interfaces";
import { cachePromise } from "./cache-promise";

export class GroupApi {
  private groupRegex = new RegExp(/([А-я]{1,3})[\W]?(\d{2})[\W]?(\d{2})/);

  constructor(private api: string) {}

  /**
   * Get group id from bot context
   * @param {MyContext} ctx Bot context
   * @returns {number | undefined} Group id or undefiend
   */
  public getGroupIdFromContext(ctx: MyContext) {
    return ctx.session.message.groupId || ctx.session.chat.defaultGroup;
  }

  /**
   * Get group from bot context
   * @param {MyContext} ctx Bot context
   * @returns Group
   */
  public async getGroupFromContext(ctx: MyContext) {
    const groupId = this.getGroupIdFromContext(ctx);

    return await this.getGroupById(groupId);
  }

  /**
   * Get all groups with caching
   * @returns {Promise<Group[]>} Array of groups
   */
  public getAllGroups = cachePromise<Group[]>(this.fetchGroups());

  /**
   * Get all groups as map
   * @returns {Promise<Map<number, string>>} Map with group id as a key and group name as a property
   */
  public async getAllGroupsMap(): Promise<Map<number, string>> {
    const result = new Map();

    const groups = await this.getAllGroups();
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
  public async getGroupById(id: number): Promise<Group | undefined> {
    const groups = await this.getAllGroups();
    return groups.find((group: Group) => group.id === id);
  }

  /**
   * Get group by name
   * @param {string} name Group name
   * @returns {Group | undefined} Group
   */
  public async getGroupByName(name: string): Promise<Group | undefined> {
    const groups = await this.getAllGroups();
    return groups.find((group: Group) => group.name === name);
  }

  /**
   * Find group in string
   * @param {string} text String to search in
   * @returns {Group | undefined} Group
   */
  public async findGroupInString(text: string) {
    const regexResult = this.groupRegex.exec(text);

    if (regexResult == null) {
      return undefined;
    }

    const groupName = regexResult.slice(1).join("-").toUpperCase();
    const group = await this.getGroupByName(groupName);

    return group;
  }

  /**
   * Fetch groups
   * @returns {Promise<Group[]>} Array of groups
   */
  private fetchGroups(): Promise<Group[]> {
    return axios
      .get<Group[]>(this.api)
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
      });
  }
}

export const groupApi = new GroupApi(config.groupApi);
