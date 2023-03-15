import { Composer } from "grammy";

import { MyContext } from "../models/my-context.type";
import { sendSchedule } from "../utils/bot-helpers";
import { getArgument } from "../utils/get-argument";

const triggerComposer = new Composer<MyContext>();

triggerComposer.command("trigger", async (ctx) => {
  const triggers = ctx.session.triggers;

  const trigger = getArgument(ctx.message?.text || "");
  if (!trigger) {
    await ctx.reply(ctx.t("trigger_not_found"), { parse_mode: "HTML" });
  }

  const isTriggerNew = trigger && triggers.includes(trigger) === false;

  if (isTriggerNew) {
    triggers.push(trigger);
    await ctx.reply(ctx.t("trigger_added", { trigger }));
  } else if (trigger) {
    triggers.splice(triggers.indexOf(trigger), 1);
    await ctx.reply(ctx.t("trigger_deleted", { trigger }));
  }

  if (triggers.length > 0) {
    await ctx.reply(
      ctx.t("trigger_list", {
        triggers: triggers.join("\n"),
      })
    );
  }

  await ctx.reply(ctx.t("trigger_list_not_found"));
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
