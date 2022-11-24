import axios from "axios";
import dayjs from "dayjs";
import { config } from "../config";
import { Schedule } from "../interfaces";

export class ScheduleApi {
  constructor(private api: string) {}

  /**
   * Get schedule for group
   * @param {number} groupIds Group id
   * @param {Dayjs} date Date for schedule
   * @returns {Schedule} Schedule
   */
  public async getSchedule(groupId: number, date = dayjs()): Promise<Schedule> {
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
  public async getManySchedules(
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
