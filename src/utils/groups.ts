import axios, { AxiosResponse } from "axios";
import { groupRegex, groupsApi } from "../constants";
import { Group } from "../models";

/**
 * Get all groups
 * @return Array of groups
 */
export async function getAllGroups(): Promise<Group[]> {
  const response: AxiosResponse<Group[]> = await axios.get<Group[]>(groupsApi);
  const groups: Group[] = response.data;

  return groups;
}

/**
 * Get group by id
 * @param {number} id Group id
 * @return {Group | undefined} Group
 */
export async function getGroupById(id: number): Promise<Group | undefined> {
  const groups = await getAllGroups();
  return groups.find((group: Group) => group.id === id);
}

/**
 * Get group by name
 * @param {string} name Group name
 * @return {Group | undefined} Group
 */
export async function getGroupByName(name: string): Promise<Group | undefined> {
  const groups = await getAllGroups();
  return groups.find((group: Group) => group.name === name);
}

/**
 * Find group in string
 * @param {string} text String to search in
 * @return {Group | undefined} Group
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
