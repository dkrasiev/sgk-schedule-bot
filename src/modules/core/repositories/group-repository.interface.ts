import { Group } from "../models/group.class";

export interface IGroupRepository {
  getAll(): Promise<Group[]>;
  getById(id: string): Promise<Group | undefined>;
  find(query: string): Promise<Group | undefined>;
  search(query: string): Promise<Group[]>;
}
