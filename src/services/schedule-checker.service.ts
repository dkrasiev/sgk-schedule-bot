import dayjs from "dayjs";
import { Bot } from "grammy";

import logger from "./../helpers/logger";
import { compareSchedule } from "./../helpers/compare-schedule";
import { groupService } from "./group.service";
import { getScheduleMessage } from "./../helpers/get-schedule-message";
import { getNextWeekday } from "../helpers/weekday";
import { scheduleService } from "./schedule.service";
import { schedules, sessions } from "../database";
import { MyContext } from "../models/my-context.type";
import { MongoSession } from "../models/mongo-session.interface";
import { Schedule } from "../models/schedule.interface";

export class ScheduleCheckerService {
  public async checkSchedule(bot: Bot<MyContext>) {
    try {
      logger.info("checking schedule...");
      logger.profile("checking schedule");

      const firstDate = getNextWeekday();
      const secondDate = getNextWeekday(firstDate.add(1, "day"));

      const updatedSchedules = await this.getUpdatedSchedules(secondDate);

      for (const [groupId, schedule] of updatedSchedules) {
        const group = await groupService.findById(groupId);
        if (group === undefined) return;

        logger.profile(group.name);

        const chats = await this.getChatsWithSubscriptionToGroup(groupId);

        logger.info(`Schedule for ${group.name} updated`);
        logger.info(`Affected chats: ${chats.length}`);

        const scheduleMessage = getScheduleMessage(schedule, group.name);

        for (const { key } of chats) {
          logger.info(`Sending schedule to ${key}`);
          bot.api
            .sendMessage(key, "Вышло новое расписание!")
            .then(() => bot.api.sendMessage(key, scheduleMessage))
            .catch(() => logger.error("Fail sending message to " + key));
        }

        logger.profile(group.name);
      }
    } catch (e) {
      logger.error("Error while checking schedule", e);
    } finally {
      logger.profile("Checking schedule");
    }
  }

  private async getChatsWithSubscription() {
    const chats = (await sessions
      .find({
        "value.subscribedGroup": { $gt: 0 },
      })
      .toArray()) as { key: string; value: MongoSession }[];

    return chats;
  }

  private async getChatsWithSubscriptionToGroup(groupId: number) {
    const chats = await sessions
      .find({
        "value.subscribedGroup": groupId,
      })
      .toArray();

    return chats;
  }

  private async getManySchedules(
    ids: number[],
    date = dayjs(),
    delay = 0
  ): Promise<Map<number, Schedule>> {
    const schedules = new Map<number, Schedule>();

    for (const id of ids) {
      const schedule: Schedule = await scheduleService.group(id, date);

      schedules.set(id, schedule);

      await this.sleep(delay);
    }

    return schedules;
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(() => resolve(), ms));
  }

  private async getUpdatedSchedules(
    date = dayjs()
  ): Promise<Map<number, Schedule>> {
    const groupIds = (await this.getChatsWithSubscription()).map(
      ({ value }) => value.subscribedGroup
    ) as number[];

    const newSchedules = await this.getManySchedules(groupIds, date, 3000);
    const lastSchedules = await schedules
      .find({ groupId: { $in: groupIds } })
      .toArray();

    // fill map
    const updatedSchedules = new Map<number, Schedule>();
    for (const [groupId, schedule] of newSchedules) {
      const lastSchedule = lastSchedules.find(
        (value) => value.groupId === groupId
      )?.schedule;

      const isEquals = compareSchedule(schedule, lastSchedule);

      if (isEquals === false && schedule.lessons.length > 0) {
        // add schedule to map
        updatedSchedules.set(groupId, schedule);

        // update db
        await schedules.updateOne(
          { groupId },
          { $set: { groupId, schedule } },
          { upsert: true }
        );
      }
    }

    return updatedSchedules;
  }
}

export const scheduleCheckerService = new ScheduleCheckerService();
