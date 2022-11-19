import { Lesson } from "./lesson.interface";

export interface Schedule {
  date: string;
  lessons: Lesson[];
}
