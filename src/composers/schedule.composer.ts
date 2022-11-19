import dayjs from "dayjs";
import { Composer } from "grammy";
import { MyContext } from "../interfaces/context.interface";
import { sendSchedule, sendShortSchedule } from "../utils";

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
  const groupId = ctx.session.message?.groupId;

  if (ctx.chat.type === "private" && groupId) {
    await sendSchedule(ctx);
    return;
  }

  await next();
});

export default scheduleComposer;
