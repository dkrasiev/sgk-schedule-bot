import { Composer } from "grammy";
import { MyContext } from "../models/my-context.type";
import { finder } from "../services/finder.service";

const subscribeComposer = new Composer<MyContext>();

subscribeComposer.command("subscribe", async (ctx) => {
  const entity = finder.searchInContext(ctx)[0];

  if (entity) {
    ctx.session.subscription = entity.id;
    await ctx.reply(ctx.t("subscribe_success", { name: entity.name }));
    return;
  }

  await ctx.reply(ctx.t("subscribe_fail"), { parse_mode: "HTML" });
});

subscribeComposer.command("unsubscribe", async (ctx) => {
  if (ctx.session.subscription) {
    const entity = finder.findById(ctx.session.subscription);
    ctx.session.subscription = undefined;

    if (entity) {
      await ctx.reply(ctx.t("unsubscribe_success", { name: entity.name }));
      return;
    }
  }

  await ctx.reply(ctx.t("unsubscribe_fail"));
});

export default subscribeComposer;
