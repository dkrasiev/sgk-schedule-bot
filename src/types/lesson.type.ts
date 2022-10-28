import {Dayjs} from 'dayjs';

export type Lesson = {
  num: string | LessonTime;
  title: string;
  teachername: string;
  cab: string;
};

export type LessonTime = {
  from: Dayjs;
  to: Dayjs;
};

export default Lesson;
