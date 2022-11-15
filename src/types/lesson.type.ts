import { Dayjs } from "dayjs";

export type Lesson = {
  num: string | LessonTime;
  title: string;
  teachername: string;
  cab: string;
};

export type LessonTime = {
  start: Dayjs;
  end: Dayjs;
};

export default Lesson;
