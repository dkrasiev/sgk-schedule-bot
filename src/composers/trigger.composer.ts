import { Composer } from "grammy";
import { MyContext } from "../interfaces/context.interface";
import { sendSchedule } from "../utils/schedule";

const triggerComposer = new Composer<MyContext>();

triggerComposer.use(async (ctx, next) => {
  if (ctx.session.chat.triggers === undefined) {
    ctx.session.chat.triggers = [];
  }

  await next();
});

triggerComposer.command("trigger", async (ctx) => {
  const trigger = ctx.msg.text.split(" ")[1]?.toLowerCase()?.trim();
  if (!trigger) {
    await ctx.reply(ctx.t("trigger_not_found"), { parse_mode: "HTML" });
  }

  const isTriggerNew = ctx.session.chat.triggers.includes(trigger) === false;

  if (trigger && isTriggerNew) {
    ctx.session.chat.triggers.push(trigger);
    await ctx.reply(ctx.t("trigger_added", { trigger }));
  } else if (trigger) {
    ctx.session.chat.triggers = ctx.session.chat.triggers.filter(
      (value: string) => value !== trigger
    );

    await ctx.reply(ctx.t("trigger_deleted", { trigger }));
  }

  const result =
    ctx.session.chat.triggers.length > 0
      ? ctx.t("trigger_list", {
          triggers: ctx.session.chat.triggers.join("\n"),
        })
      : ctx.t("trigger_list_not_found");

  await ctx.reply(result);
});

triggerComposer.on("message:text", async (ctx, next) => {
  const triggered = ctx.session.chat.triggers.some((trigger: string) =>
    ctx.message.text.toLowerCase().split(/\s/m).includes(trigger)
  );

  if (triggered) {
    await sendSchedule(ctx);
    return;
  }

  await next();
});

export default triggerComposer;
