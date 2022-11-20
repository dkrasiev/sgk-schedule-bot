import axios from "axios";
import { groupRegex, groupsApi } from "../constants";
import { groupsCollection } from "../db";
import { Group } from "../interfaces";
import { cachePromise } from "./cache-promise";
import logger from "./logger";

/**
 * Get all groups with caching
 * @returns {Promise<Group[]>} Array of groups
 */
export const getAllGroups = cachePromise<Group[]>(fetchGroups());

/**
 * Get all groups without caching
 * @returns {Promise<Group[]>} Array of groups
 */
export async function fetchGroups() {
  return axios
    .get<Group[]>(groupsApi)
    .then((response) => response.data)
    .catch((e) => {
      logger.error("Failed to get groups", e);

      return groupsCollection.find().toArray();
    });
}

/**
 * Get all groups as map
 * @returns {Promise<Map<number, string>>} Map with group id as a key and group name as a property
 */
export async function getAllGroupsMap(): Promise<Map<number, string>> {
  const result = new Map();

  const groups = await getAllGroups();
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
export async function getGroupById(id: number): Promise<Group | undefined> {
  const groups = await getAllGroups();
  return groups.find((group: Group) => group.id === id);
}

/**
 * Get group by name
 * @param {string} name Group name
 * @returns {Group | undefined} Group
 */
export async function getGroupByName(name: string): Promise<Group | undefined> {
  const groups = await getAllGroups();
  return groups.find((group: Group) => group.name === name);
}

/**
 * Find group in string
 * @param {string} text String to search in
 * @returns {Group | undefined} Group
 */
export async function getGroupFromString(text: string, regex = groupRegex) {
  const regexResult = regex.exec(text);

  if (regexResult == null) {
    return undefined;
  }

  const groupName = regexResult.slice(1).join("-").toUpperCase();
  const group = await getGroupByName(groupName);

  return group;
}
