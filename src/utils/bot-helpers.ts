import dayjs from "dayjs";
import { Bot } from "grammy";
import { chatsCollection, scheduleCollection } from "../db";
import { MongoSession, MyContext, Schedule } from "../interfaces";
import logger from "./logger";
import { compareSchedule } from "./compare-schedule";
import { getAllGroups } from "./groups";
import { getScheduleMessage } from "./messages";
import { getManySchedules } from "./schedule";
import { getNextWeekday } from "./workdate";

/**
 * Remove subscription
 * @param {MyContext} ctx Bot context
 * @returns {boolean} Unsubscribe result
 */
export async function removeSubscription(ctx: MyContext) {
  if (ctx.session.chat.subscribedGroup) {
    ctx.session.chat.subscribedGroup = 0;
    return true;
  }

  return false;
}

/**
 * Returns chats withSubscription
 * @returns Array of chats with subscription
 */
async function getChatsWithSubscription() {
  const chats = (await chatsCollection
    .find({
      "value.subscribedGroup": { $gt: 0 },
    })
    .toArray()) as { key: string; value: MongoSession }[];

  return chats;
}

/**
 * Get chat with subscription
 * @param {number} groupId Group id
 * @returns Array of chats with subscription to groupId
 */
async function getChatWithSubscription(groupId: number) {
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
async function getUpdatedSchedules(date = dayjs()) {
  const groupIds = (await getChatsWithSubscription()).map(
    ({ value }) => value.subscribedGroup
  ) as number[];

  const newSchedules = await getManySchedules(groupIds, date);
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

/**
 * Check schedule and send updates
 * @param {Bot<MyContext>} bot Telegram bot
 */
export async function checkSchedule(bot: Bot<MyContext>) {
  const profiler = logger.startTimer();
  logger.info("checking schedule...");

  const groups = await getAllGroups();

  const firstDate = getNextWeekday();
  const secondDate = getNextWeekday(firstDate);

  const updatedSchedules = await getUpdatedSchedules(secondDate);

  for (const [groupId, schedule] of updatedSchedules) {
    // get group object
    const group = groups.find((group) => group.id === groupId);
    if (group === undefined) return;

    // get chat with subscription to groupId
    const chats = await getChatWithSubscription(groupId);

    logger.info(`${groupId} updated and affected ${chats.length} chats`);

    const message =
      "Вышло новое расписание!\n\n" + getScheduleMessage(schedule, group);

    for (const { key } of chats) {
      // send schedule
      await bot.api.sendMessage(key, message).catch(() => {
        logger.error("failed to send message to " + key);
      });
    }
  }

  profiler.done({ message: "done" });
}
