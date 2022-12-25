import { Composer } from "grammy";
import { MyContext } from "../models/my-context.type";
import { groupService } from "../services/group.service";

const subscribeComposer = new Composer<MyContext>();

subscribeComposer.command("subscribe", async (ctx) => {
  if (!ctx.chat) return;

  const group = await groupService.findInContext(ctx);

  if (!group) {
    await ctx.reply(ctx.t("subscribe_fail"), { parse_mode: "HTML" });
    return;
  }

  ctx.session.subscribedGroup = group.id;

  await ctx.reply(ctx.t("subscribe_success", { name: group.name }));
});

subscribeComposer.command("unsubscribe", async (ctx) => {
  const group = await groupService.findById(ctx.session.defaultGroup);
  if (!group) return;

  const removeSubscriptionResult = removeSubscription(ctx);

  if (removeSubscriptionResult === false) {
    await ctx.reply(ctx.t("unsubscribe_fail"));
    return;
  }

  await ctx.reply(ctx.t("unsubscribe_success", { name: group.name }));
});

/**
 * Helper for removing subscription
 * @param {MyContext} ctx Bot context
 * @returns {boolean} Unsubscribe result
 */
function removeSubscription(ctx: MyContext): boolean {
  if (ctx.session.subscribedGroup) {
    ctx.session.subscribedGroup = 0;
    return true;
  }

  return false;
}

export default subscribeComposer;
