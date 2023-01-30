import axios from "../axios";
import { config } from "../config";
import { Teacher } from "../models/teacher.interface";
import { cachePromise } from "../helpers/cache-promise";
import { MyContext } from "../models/my-context.type";
import { Api } from "../models/api";
import { teachers } from "../database";
import logger from "../helpers/logger";

export class TeacherService implements Api<Teacher, MyContext> {
  constructor(private api: string) {}

  public async findInContext(ctx: MyContext) {
    const teacher =
      (ctx.message?.text && (await this.findInText(ctx.message.text))) ||
      (await this.findById(ctx.session.defaultGroup.toString()));

    return teacher;
  }

  public async findInText(text: string) {
    const teachers = await this.getAll();

    return teachers.find(
      (teacher) => text.includes(teacher.id) || text.includes(teacher.name)
    );
  }

  public async findByName(name: string) {
    const teachers = await this.getAll();

    return teachers.find(
      (teacher) =>
        teacher.name.toLowerCase().trim() === name.toLowerCase().trim()
    );
  }

  public async findById(id: string) {
    const teachers = await this.getAll();

    return teachers.find((teacher) => teacher.id === id);
  }

  public async findMany(query: string): Promise<Teacher[]> {
    const teachers: Teacher[] = await this.getAll();

    return teachers.filter(({ name }) => this.search(name, query));
  }

  public getAll: () => Promise<Teacher[]> = cachePromise<Teacher[]>(
    axios
      .get<Teacher[]>(this.api)
      .then(({ data }): Teacher[] => {
        const result: Teacher[] = data
          .map((teacher: Teacher): Teacher => {
            const name = teacher.name
              .split(" ")
              .filter((v) => v)
              .join(" ");

            return { ...teacher, name };
          })
          // filter Администратор, Методист и тд
          .filter((teacher: Teacher) => teacher.name.split(" ").length > 1);

        result.forEach((teacher: Teacher) =>
          teachers.updateOne(
            { id: teacher.id },
            { $set: teacher },
            { upsert: true }
          )
        );

        return result;
      })
      .catch((e): Promise<Teacher[]> => {
        logger.error("Failed to get teachers", e);

        return teachers.find().toArray();
      })
  );

  private search(first: string, second: string): boolean {
    first = first.toLowerCase().trim();
    second = second.toLowerCase().trim();

    return first.includes(second);
  }
}

export const teacherService = new TeacherService(config.api.teachers);
