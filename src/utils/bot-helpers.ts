import { MyContext } from "../models";

/**
 * Remove subscription
 * @param {MyContext} ctx Bot context
 * @return {boolean} Unsubscribe result
 */
export async function removeSubscription(ctx: MyContext) {
  if (ctx.session.chat.subscription.groupId) {
    ctx.session.chat.subscription = {
      groupId: 0,
      lastSchedule: undefined,
    };
    return true;
  }

  return false;
}

// /**
//  * Проверяет обновления расписания
//  * @param {Bot<MyContext>} bot Telegram bot
//  */
// export async function checkSchedule(bot: Bot<MyContext>) {
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
// }
