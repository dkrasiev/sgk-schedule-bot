import dayjs from "dayjs";
import { Composer } from "grammy";

import { MyContext } from "../models/my-context.type";
import {
  sendSchedule,
  sendShortSchedule,
} from "../modules/common/utils/bot-helpers";

const scheduleComposer = new Composer<MyContext>();

scheduleComposer.command("schedule", async (ctx) => {
  await sendSchedule(ctx);
});

scheduleComposer.command("today", async (ctx) => {
  await sendShortSchedule(ctx);
});

scheduleComposer.command("tomorrow", async (ctx) => {
  const date = dayjs().add(1, "day");
  await sendShortSchedule(ctx, date);
});

scheduleComposer.on("message:text", async (ctx, next) => {
  if (
    ctx.chat.type === "private" &&
    ctx.message.text.startsWith("/") === false
  ) {
    await sendSchedule(ctx);
    return;
  }

  await next();
});

export default scheduleComposer;
