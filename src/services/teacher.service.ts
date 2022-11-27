import axios from "axios";
import { config } from "../config";
import { Teacher } from "../interfaces/teacher.interface";
import { cachePromise } from "../helpers/cache-promise";
import { MyContext, Schedule } from "../interfaces";
import { Api } from "../interfaces/api";
import dayjs from "dayjs";

export class TeacherService implements Api<Teacher, MyContext> {
  constructor(private teachersApi: string, private scheduleApi: string) {}

  public async getSchedule(id: string, date = dayjs()) {
    const formatedDate = date.format("YYYY-MM-DD");
    const url = [this.scheduleApi, "teacher", formatedDate, id].join("/");

    return axios.get<Schedule>(url).then((response) => response.data);
  }

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

      return teachers;
    })
  );
}

export const teacherService = new TeacherService(
  config.teachersApi,
  config.scheduleApi
);
