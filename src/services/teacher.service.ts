import axios from "axios";
import { config } from "../config";
import { Teacher } from "../models/teacher.interface";
import { cachePromise } from "../helpers/cache-promise";
import { MyContext } from "../models/my-context.type";
import { Api } from "../models/api";

export class TeacherService implements Api<Teacher, MyContext> {
  constructor(private teachersApi: string) {}

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

  public getAll = cachePromise(
    axios.get<Teacher[]>(this.teachersApi).then((response) => {
      const teachers = response.data;

      teachers.forEach((teacher: Teacher) => {
        teacher.name = teacher.name
          .split(" ")
          .filter((v) => v)
          .join(" ");
      });

      // filter Администратор, Методист и тд
      return teachers.filter(
        (teacher: Teacher) => teacher.name.split(" ").length > 1
      );
    })
  );
}

export const teacherService = new TeacherService(config.api.teachers);
