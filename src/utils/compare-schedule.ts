import { Schedule } from "../models";

/**
 * Compare two schedules
 * @param {Schedule} a First schedule
 * @param {Schedule} b Second schedule
 * @return {boolean} Comparison result
 */
export function compareSchedule(a: Schedule, b: Schedule) {
  if (a.date !== b.date) return false;

  if (a.lessons.length !== b.lessons.length) return false;

  for (let i = 0; i < a.lessons.length; i++) {
    const lessonA = a.lessons[i];
    const lessonB = b.lessons[i];

    if (lessonA.num !== lessonB.num) return false;
    if (lessonA.title !== lessonB.title) return false;
    if (lessonA.teachername !== lessonB.teachername) return false;
    if (lessonA.cab !== lessonB.cab) return false;
  }

  return true;
}
