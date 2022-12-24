import dayjs from "dayjs";
import { Composer } from "grammy";

import { sendSchedule, sendShortSchedule } from "../helpers/bot-helpers";
import { MyContext } from "../models/my-context.type";
import { groupService } from "../services/group.service";
import { teacherService } from "../services/teacher.service";

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
  const group = await groupService.findInText(ctx.message.text);
  const teacher = await teacherService.findInText(ctx.message.text);

  if (ctx.chat.type === "private" && (group || teacher)) {
    await sendSchedule(ctx);
    return;
  }

  await next();
});

export default scheduleComposer;
