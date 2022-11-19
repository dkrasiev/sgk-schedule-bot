import { Dayjs } from "dayjs";

export interface Lesson {
  num: string | LessonTime;
  title: string;
  teachername: string;
  cab: string;
}

export interface LessonTime {
  start: Dayjs;
  end: Dayjs;
}
