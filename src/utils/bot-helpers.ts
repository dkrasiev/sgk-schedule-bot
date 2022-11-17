import dayjs from "dayjs";
import { Bot } from "grammy";
import { chatsCollection } from "../db";
import { MongoSession, MyContext } from "../models";
import { compareSchedule } from "./compare-schedule";
import { getGroupById } from "./groups";
import { log } from "./log";
import { getScheduleMessage } from "./messages";
import { getManySchedules, getSchedule } from "./schedule";
import { getNextWeekday } from "./workdate";

/**
 * Remove subscription
 * @param {MyContext} ctx Bot context
 * @return {boolean} Unsubscribe result
 */
export async function removeSubscription(ctx: MyContext) {
  if (ctx.session.chat.subscription) {
    ctx.session.chat.subscription = undefined;
    return true;
  }

  return false;
}

/**
 * Subscribe chat to schedule updates
 * @param {MyContext} ctx Bot Context
 * @param groupId Group id
 */
export async function createSubscription(ctx: MyContext, groupId: number) {
  const firstDate = getNextWeekday(dayjs());
  const secondDate = getNextWeekday(firstDate);

  const schedule = await getSchedule(groupId, secondDate);

  ctx.session.chat.subscription = {
    groupId,
    lastSchedule: schedule,
  };
}

/**
 * Check schedule and send updates
 * @param {Bot<MyContext>} bot Telegram bot
 */
export async function checkSchedule(bot: Bot<MyContext>) {
  const chatsWithSubscription = (
    (await chatsCollection.find().toArray()) as {
      key: string;
      value: MongoSession;
    }[]
  ).filter((chat) => chat.value.subscription);

  console.log(
    chatsWithSubscription.map((value) => value.value.subscription?.groupId)
  );

  const schedules = await getManySchedules(
    chatsWithSubscription.map(
      (chat) => chat.value.subscription?.groupId
    ) as number[]
  );

  for (const chat of chatsWithSubscription) {
    if (chat.value.subscription === undefined) return;

    const group = await getGroupById(chat.value.subscription.groupId);

    if (group === undefined) continue;

    const oldSchedule = chat.value.subscription.lastSchedule;
    const newSchedule = schedules.get(group.id);

    if (newSchedule === undefined) continue;

    const isEquals = compareSchedule(oldSchedule, newSchedule);
    const isScheduleNew =
      isEquals === false && newSchedule && newSchedule.lessons.length > 0;

    if (isScheduleNew) {
      log(group.name + " расписание изменилось");

      chat.value.subscription.lastSchedule = newSchedule;
      await chatsCollection.updateOne({ key: chat.key }, chat);

      const message = getScheduleMessage(newSchedule, group);

      await bot.api.sendMessage(chat.key, "Вышло новое расписание!");
      await bot.api.sendMessage(chat.key, message);
    } else {
      log(group.name + " расписание не изменилось");
    }
  }

  // const filter = {
  //   value: { defaultGroup: { $gt: 0 } },
  // };
  // const chatsWithSubscription = await chatsCollection.find().toArray();
  // console.log(chatsWithSubscription);
  // for (const doc of chatsWithSubscription) {
  //   log(doc.value);
  // }
  // log("start checking schedule");
  // log("chats have been loaded");
  // const groups = await getAllGroups();
  // log("groups have been loaded");
  // log("fetching schedules...");
  // const nextDate: Dayjs = getNextWorkday(dayjs().add(1, "day"));
  // const schedules: Map<number, Schedule> = await fetchManySchedules(
  //   Array.from(groups).map((group: Group) => group.id),
  //   nextDate
  // );
  // log("compare schedules...");
  // chatsWithSubscription
  //   .forEach(async (chat) => {
  //     const group = subscribedGroups.find(
  //       (group) => group.id === chat.subscription.groupId
  //     );
  //     if (!group || !chat.subscription.groupId) continue;
  //     const newSchedule = schedules.get(chat.subscription.groupId);
  //     if (!newSchedule) continue;
  //     const lastSchedule = chat.subscription.lastSchedule;
  //     const isEquals = compareSchedule(lastSchedule, newSchedule);
  //     const isScheduleNew = isEquals === false && newSchedule.lessons.length;
  //     try {
  //       if (isScheduleNew) {
  //         log(group.name + " расписание изменилось");
  //         chat.subscription.lastSchedule = newSchedule;
  //         await chat.save();
  //         const message = getScheduleMessage(newSchedule, group);
  //         await bot.api.sendMessage(chat.id, "Вышло новое расписание!");
  //         await bot.api.sendMessage(chat.id, message);
  //       } else {
  //         log(group.name + " расписание не изменилось");
  //       }
  //     } catch (error) {
  //       log("ошибка при отправки сообщения в " + chat.id);
  //     }
  //   })
  //   .then(() => log("done"));
}
