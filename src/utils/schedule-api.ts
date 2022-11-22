import axios from "axios";
import dayjs from "dayjs";
import { config } from "../config";
import { Collection, LessonTime, Schedule } from "../interfaces";

export class ScheduleApi {
  private times: Collection<string> = {
    "1": "08:25-10:00",
    "2": "10:10-11:45",
    "3": "12:15-13:50",
    "4": "14:00-15:35",
    "5": "15:45-17:20",
    "6": "17:30-19:05",
    "7": "19:15-20:50",
    "1.1": "08:25-09:10",
    "1.2": "09:15-10:00",
    "2.1": "10:10-10:55",
    "2.2": "11:00-11:45",
    "3.1": "12:15-13:00",
    "3.2": "13:05-13:50",
    "4.1": "14:00-14:45",
    "4.2": "14:50-15:35",
    "5.1": "15:45-16:30",
    "5.2": "16:35-17:20",
    "6.1": "17:30-18:15",
    "6.2": "18:20-19:05",
    "7.1": "19:15-20:00",
    "7.2": "20:05-20:50",
  };

  private mondayTimes: Collection<string> = {
    "1": "09:15-10:55",
    "2": "11:00-13:00",
    "3": "13:05-14:45",
    "4": "14:50-16:30",
    "5": "16:35-18:15",
    "6": "18:20-20:00",
    "7": "20:05-21:45",
    "1.1": "09:15-10:00",
    "1.2": "10:10-10:55",
    "2.1": "11:00-11:45",
    "2.2": "12:15-13:00",
    "3.1": "13:05-13:50",
    "3.2": "14:00-14:45",
    "4.1": "14:50-15:35",
    "4.2": "15:45-16:30",
    "5.1": "16:35-17:20",
    "5.2": "17:30-18:15",
    "6.1": "18:20-19:05",
    "6.2": "19:15-20:00",
    "7.1": "20:05-20:50",
    "7.2": "21:00-21:45",
  };

  constructor(private api: string) {}

  /**
   * Get schedule for group
   * @param {number} groupIds Group id
   * @param {Dayjs} date Date for schedule
   * @returns {Schedule} Schedule
   */
  public async getScheduleForGroup(
    groupId: number,
    date = dayjs()
  ): Promise<Schedule> {
    const url = this.getScheduleUrl(groupId, date);
    const response = await axios.get<Schedule>(url);

    return response.data;
  }

  /**
   * Get many schedules for groups
   * @param {number[]} groupIds Group ids
   * @param {Dayjs} date Date for schedule
   * @returns {Promise<Map<number, Schedule>>} Map with group id as key and schedule as value
   */
  public async getSchedulesForGroups(
    groupIds: number[],
    date = dayjs()
  ): Promise<Map<number, Schedule>> {
    groupIds = Array.from(new Set(groupIds));

    const promises = groupIds.map((groupId) =>
      axios.get<Schedule>(this.getScheduleUrl(groupId, date))
    );

    const schedules = new Map<number, Schedule>();
    const responses = await axios.all(promises);
    const pattern = /schedule\/(.*)\//;

    for (const response of responses) {
      if (!response.config || !response.config.url) continue;

      const match = response.config.url.match(pattern);
      if (match == null) continue;

      const groupId = Number(match[1]);
      schedules.set(groupId, response.data);
    }

    return schedules;
  }

  /**
   * Transform lesson's number to lesson's time
   * @param {string} num Lesson's number
   * @param {boolean} isMonday Use monday schedule
   * @returns {string} Lesson's time
   */
  public numToTime(num: string, isMonday = false): LessonTime {
    const selectedTime = isMonday ? this.mondayTimes[num] : this.times[num];

    const lessonTime = this.convertToLessonTime(selectedTime);

    return lessonTime;
  }

  /**
   * Transform string to lesson's time
   * @param {string} time String in format: HH:mm-HH:mm
   * @returns {LessonTime} Lesson's time
   */
  private convertToLessonTime(time: string) {
    const [start, end] = time.split("-").map((time) => {
      const [hours, minutes] = time.split(":").map((v) => +v);

      return dayjs().hour(hours).minute(minutes);
    });

    return { start, end };
  }

  /**
   * Get schedule url
   * @param {number} groupId Group id
   * @param {Dayjs} date Date
   * @returns {string} URL
   */
  private getScheduleUrl(groupId: number, date = dayjs()): string {
    const dateString = date.format("YYYY-MM-DD");
    return [this.api, groupId, dateString].join("/");
  }
}

export const scheduleApi = new ScheduleApi(config.scheduleApi);
