import { Composer } from "grammy";
import { MyContext } from "../interfaces/context.interface";
import { removeSubscription } from "../utils/bot-helpers";
import { groupApi } from "../utils/group-api";

const subscribeComposer = new Composer<MyContext>();

subscribeComposer.command("subscribe", async (ctx) => {
  if (!ctx.chat) return;

  const group = await groupApi.getGroupFromContext(ctx);

  if (!group) {
    await ctx.reply(ctx.t("subscribe_fail"), { parse_mode: "HTML" });
    return;
  }

  ctx.session.chat.subscribedGroup = group.id;

  await ctx.reply(ctx.t("subscribe_success", { name: group.name }));
});

subscribeComposer.command("unsubscribe", async (ctx) => {
  const group = await groupApi.getGroupById(ctx.session.chat.defaultGroup);
  if (!group) return;

  const removeSubscriptionResult = await removeSubscription(ctx);

  if (removeSubscriptionResult === false) {
    await ctx.reply(ctx.t("unsubscribe_fail"));
    return;
  }

  await ctx.reply(ctx.t("unsubscribe_success", { name: group.name }));
});

export default subscribeComposer;
