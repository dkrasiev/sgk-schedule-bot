import { Teacher } from "../models/teacher.class";

export interface ITeacherRepository {
  getAll(): Promise<Teacher[]>;
  getById(id: string): Promise<Teacher | undefined>;
  find(query: string): Promise<Teacher | undefined>;
  search(query: string): Promise<Teacher[]>;
}
