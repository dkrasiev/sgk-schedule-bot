import dayjs from "dayjs";
import { Composer } from "grammy";
import { MyContext } from "../models/context.interface";
import { getGroupFromString, sendSchedule, sendShortSchedule } from "../utils";

const scheduleComposer = new Composer<MyContext>();

scheduleComposer.command("schedule", async (ctx) => {
  await sendSchedule(ctx);
});

scheduleComposer.command("today", async (ctx) => {
  const date = dayjs();
  await sendShortSchedule(ctx, date);
});

scheduleComposer.command("tomorrow", async (ctx) => {
  const date = dayjs().add(1, "day");
  await sendShortSchedule(ctx, date);
});

scheduleComposer.on("message:text", async (ctx, next) => {
  const group = await getGroupFromString(ctx.msg.text);

  if (ctx.chat.type === "private" && group) {
    sendSchedule(ctx);
    return;
  }

  await next();
});

export default scheduleComposer;
