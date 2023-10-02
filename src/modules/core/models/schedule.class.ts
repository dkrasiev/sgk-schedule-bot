import { Lesson } from "./lesson.class";

export class Schedule {
  constructor(
    readonly date: string,
    readonly lessons: Lesson[],
  ) {}
}
