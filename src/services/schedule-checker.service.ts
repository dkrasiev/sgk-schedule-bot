import dayjs from "dayjs";
import { Bot } from "grammy";

import { schedules, sessions } from "../database";
import { getNextWeekday } from "../helpers/weekday";
import { MySession } from "../models/my-session.interface";
import { MyContext } from "../models/my-context.type";
import { Schedule } from "../models/schedule.interface";
import { compareSchedule } from "./../helpers/compare-schedule";
import { getScheduleMessage } from "./../helpers/get-schedule-message";
import logger from "./../helpers/logger";
import { groupService } from "./group.service";
import { scheduleService } from "./schedule.service";

export class ScheduleCheckerService {
  public async checkSchedule(bot: Bot<MyContext>) {
    logger.profile("checking schedule");
    try {
      logger.info("checking schedule...");

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
          bot.api
            .sendMessage(key, "Вышло новое расписание!")
            .then(() => bot.api.sendMessage(key, scheduleMessage))
            .then(() => logger.info(`Schedule sended to ${key}`))
            .catch(() => logger.error("Fail sending message to " + key));
        }

        logger.profile(group.name);
      }
    } catch (e) {
      logger.error("Error while checking schedule", e);
    } finally {
      logger.profile("checking schedule");
    }
  }

  private async getChatsWithSubscription() {
    const chats: { key: string; value: MySession }[] = (await sessions
      .find({
        "value.subscribedGroup": { $gt: 0 },
      })
      .toArray()) as { key: string; value: MySession }[];

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
    date = dayjs()
  ): Promise<Map<number, Schedule>> {
    const schedules = new Map<number, Schedule>();

    for (const id of ids) {
      const schedule: Schedule = await scheduleService.group(id, date);

      schedules.set(id, schedule);
    }

    return schedules;
  }

  private async getUpdatedSchedules(
    date = dayjs()
  ): Promise<Map<number, Schedule>> {
    const groupIds = (await this.getChatsWithSubscription()).map(
      ({ value }) => value.subscribedGroup
    ) as number[];

    const newSchedules = await this.getManySchedules(groupIds, date);
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

      if (isEquals === false && schedule.lessons?.length > 0) {
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
