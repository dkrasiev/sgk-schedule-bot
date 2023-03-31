import dayjs from "dayjs";
import { Bot } from "grammy";

import { schedules, sessions } from "../database";
import { MyContext } from "../models/my-context.type";
import { MySession } from "../models/my-session.interface";
import { ScheduleEntity } from "../models/schedule-entity.class";
import { Schedule } from "../models/schedule.interface";
import { compareSchedule } from "../utils/compare-schedule";
import { getWeekday } from "../utils/get-weekday";
import { getScheduleMessage } from "../utils/get-schedule-message";
import logger from "../utils/logger";
import { finder } from "./finder.service";
import { sgkApi } from "./sgk-api.service";

export class ScheduleCheckerService {
  public async checkSchedule(bot: Bot<MyContext>) {
    logger.profile("checking schedule");
    try {
      logger.info("checking schedule...");

      const date = getWeekday(1);

      const updatedSchedules = await this.getUpdatedSchedules(date);

      for (const [entity, schedule] of updatedSchedules) {
        const group = finder.findById(entity.toString());
        if (group === undefined) return;

        logger.profile(group.name);

        const chats = await this.getChatsWithSubscriptionToEntity(entity);

        logger.info(`Schedule for ${group.name} updated`);
        logger.info(`Affected chats: ${chats.length}`);

        const scheduleMessage = getScheduleMessage(schedule, group.name);

        for (const { key } of chats) {
          bot.api
            .sendMessage(key, "Вышло новое расписание!")
            .then(() => bot.api.sendMessage(key, scheduleMessage))
            .then(() => logger.info(`Schedule sended to ${key}`))
            .catch(logger.error);
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
        "value.subscription": { $exists: true, $ne: null },
      })
      .toArray()) as { key: string; value: MySession }[];

    return chats;
  }

  private async getChatsWithSubscriptionToEntity(entity: ScheduleEntity) {
    const chats = await sessions
      .find({
        "value.subscription": entity.id,
      })
      .toArray();

    return chats;
  }

  private async getManySchedules(
    entities: ScheduleEntity[],
    date = dayjs()
  ): Promise<Map<ScheduleEntity, Schedule>> {
    const schedules = new Map<ScheduleEntity, Schedule>();

    for (const entity of entities) {
      const schedule: Schedule = await sgkApi.getSchedule(entity, date);

      schedules.set(entity, schedule);
    }

    return schedules;
  }

  private async getUpdatedSchedules(
    date = dayjs()
  ): Promise<Map<ScheduleEntity, Schedule>> {
    const ids = (await this.getChatsWithSubscription()).map(
      ({ value }) => value.subscription
    ) as string[];
    const entities: ScheduleEntity[] = ids
      .map((id) => finder.findById(id))
      .filter(Boolean) as ScheduleEntity[];

    const newSchedules = await this.getManySchedules(entities, date);
    const lastSchedulesFromDB = await schedules
      .find({ subscription: { $in: ids } })
      .toArray();

    // fill map
    const updatedSchedules = new Map<ScheduleEntity, Schedule>();
    for (const [entity, schedule] of newSchedules) {
      const lastSchedule: Schedule | undefined = lastSchedulesFromDB.find(
        (schedule) => schedule.id === entity.id
      )?.schedule;

      const isEquals: boolean = compareSchedule(schedule, lastSchedule);

      if (isEquals === false && schedule.lessons?.length > 0) {
        // add schedule to map
        updatedSchedules.set(entity, schedule);

        // update db
        await schedules.updateOne(
          { id: entity.id },
          { $set: { id: entity.id, schedule } },
          { upsert: true }
        );
      }
    }

    return updatedSchedules;
  }
}

export const scheduleCheckerService = new ScheduleCheckerService();
