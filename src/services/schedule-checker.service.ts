import dayjs from "dayjs";
import cron from "node-cron";
import { Bot } from "grammy";

import logger from "./../helpers/logger";
import { chatsCollection, scheduleCollection } from "../db";
import { MongoSession, MyContext, Schedule } from "../interfaces";
import { compareSchedule } from "./../helpers/compare-schedule";
import { groupService } from "./group.service";
import { getScheduleMessage } from "./../helpers/get-schedule-message";
import { getNextWeekday } from "../helpers/weekday";

export class ScheduleCheckerService {
  /**
   * Set schedule checking by cron expression
   * @param {string} cronExpression Cron expression
   * @param {Bot<MyContext>} bot Telegram bot
   */
  public setCheckingBySchedule(cronExpression: string, bot: Bot<MyContext>) {
    cron.schedule(cronExpression, () => this.checkSchedule(bot));
  }

  /**
   * Check schedule and send updates
   * @param {Bot<MyContext>} bot Telegram bot
   */
  public async checkSchedule(bot: Bot<MyContext>) {
    const profiler = logger.startTimer();

    try {
      logger.info("checking schedule...");

      const groups = await groupService.getAll();

      const firstDate = getNextWeekday();
      const secondDate = getNextWeekday(firstDate.add(1, "day"));

      const updatedSchedules = await this.getUpdatedSchedules(secondDate);

      for (const [groupId, schedule] of updatedSchedules) {
        const group = groups.find((group) => group.id === groupId);
        if (group === undefined) return;

        const chats = await this.getChatsWithSubscriptionToGroup(groupId);

        logger.info(`${groupId} updated and affected ${chats.length} chats`);

        const scheduleMessage = getScheduleMessage(schedule, group.name);

        for (const { key } of chats) {
          try {
            await bot.api.sendMessage(key, "Вышло новое расписание!");
            await bot.api.sendMessage(key, scheduleMessage);
          } catch (e) {
            logger.error("Fail sending message to " + key);
          }
        }
      }
    } catch (e) {
      logger.error("Error while checking schedule", e);
    } finally {
      profiler.done({ message: "done", start: profiler.start });
    }
  }

  /**
   * Returns chats withSubscription
   * @returns Array of chats with subscription
   */
  private async getChatsWithSubscription() {
    const chats = (await chatsCollection
      .find({
        "value.subscribedGroup": { $gt: 0 },
      })
      .toArray()) as { key: string; value: MongoSession }[];

    return chats;
  }

  /**
   * Get chats with subscription to specified group
   * @param {number} groupId Group id
   * @returns Array of chats with subscription to specified group
   */
  private async getChatsWithSubscriptionToGroup(groupId: number) {
    const chats = await chatsCollection
      .find({
        "value.subscribedGroup": groupId,
      })
      .toArray();

    return chats;
  }

  /**
   * Get schedules that have updates
   * @returns {Map<number, Schedule>} Updated schedules
   */
  private async getUpdatedSchedules(date = dayjs()) {
    const groupIds = (await this.getChatsWithSubscription()).map(
      ({ value }) => value.subscribedGroup
    ) as number[];

    const newSchedules = await groupService.getManySchedules(
      groupIds,
      date,
      1000
    );
    const lastSchedules = await scheduleCollection
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
        await scheduleCollection.updateOne(
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
