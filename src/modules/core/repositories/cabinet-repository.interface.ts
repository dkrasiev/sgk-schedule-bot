import { Cabinet } from "../models/cabinet.class";

export interface ICabinetRepository {
  getAll(): Promise<Cabinet[]>;
  getById(id: string): Promise<Cabinet | undefined>;
  find(query: string): Promise<Cabinet | undefined>;
  search(query: string): Promise<Cabinet[]>;
}
