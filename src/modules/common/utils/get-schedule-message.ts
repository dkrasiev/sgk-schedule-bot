import { Schedule } from '@modules/domain'

import { times } from './times'

/**
 * Get schedule message for user
 * @param {Schedule | undefined} schedule Schedule
 * @param {string | undefined} title Title
 * @returns {string} Message for user
 */
export function getScheduleMessage(
  schedule?: Schedule,
  title?: string,
): string {
  if (!schedule) return 'Не удалось получить расписание'

  let message = [title, schedule.date].filter(Boolean).join('\n') + '\n\n'

  if (schedule.lessons.length === 0) {
    return message + 'Расписания нет'
  }

  for (const lesson of schedule.lessons) {
    const time = [lesson.num, times[lesson.num]].filter(Boolean).join(' ')

    message +=
      [time, lesson.title, lesson.teachername, lesson.nameGroup, lesson.cab]
        .filter(Boolean)
        .join('\n') + '\n\n'
  }

  return message
}
