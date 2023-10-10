import { Schedule } from '../../core/entities/schedule.class'

export function compareSchedule(a?: Schedule, b?: Schedule) {
  if (!a || !b) return false

  if (a.date !== b.date) return false

  if (a.lessons.length !== b.lessons.length) return false

  for (let i = 0; i < a.lessons.length; i++) {
    const lessonA = a.lessons[i]
    const lessonB = b.lessons[i]

    if (lessonA.num !== lessonB.num) return false
    if (lessonA.title !== lessonB.title) return false
    if (lessonA.teachername !== lessonB.teachername) return false
    if (lessonA.cab !== lessonB.cab) return false
  }

  return true
}
