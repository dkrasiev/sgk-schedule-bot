import { Composer } from "grammy";

import { MyContext } from "../models/my-context.type";
import { sendSchedule } from "../helpers/bot-helpers";
import { getArgument } from "../helpers/get-argument";

const triggerComposer = new Composer<MyContext>();

triggerComposer.command("trigger", async (ctx) => {
  const trigger = getArgument(ctx.message?.text || "");

  if (!trigger) {
    await ctx.reply(ctx.t("trigger_not_found"), { parse_mode: "HTML" });
  }

  const isTriggerNew = ctx.session.triggers.includes(trigger) === false;

  if (trigger && isTriggerNew) {
    ctx.session.triggers.push(trigger);
    await ctx.reply(ctx.t("trigger_added", { trigger }));
  } else if (trigger) {
    ctx.session.triggers = ctx.session.triggers.filter(
      (value: string) => value !== trigger
    );

    await ctx.reply(ctx.t("trigger_deleted", { trigger }));
  }

  const result =
    ctx.session.triggers.length > 0
      ? ctx.t("trigger_list", {
          triggers: ctx.session.triggers.join("\n"),
        })
      : ctx.t("trigger_list_not_found");

  await ctx.reply(result);
});

triggerComposer.on("message:text", async (ctx, next) => {
  const triggered = ctx.session.triggers.some((trigger: string) =>
    ctx.message.text.toLowerCase().split(/\s/m).includes(trigger)
  );

  if (triggered) {
    await sendSchedule(ctx);
    return;
  }

  await next();
});

export default triggerComposer;
