import { DurationModel } from "./duration-model.interface";

export interface Lesson {
  num: string | DurationModel;
  title: string;
  teachername: string;
  cab: string;
  nameGroup?: string;
}
