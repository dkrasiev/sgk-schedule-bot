import { Composer } from "grammy";
import { groupApi } from "../utils/groups-api";
import { MyContext } from "../interfaces/context.interface";

const miscComposer = new Composer<MyContext>();

miscComposer.command("groups", async (ctx) => {
  const groups = await groupApi.getAllGroups();

  const groupsNameArray = groups
    .filter((group) => group.name.length > 2)
    .map((group) => group.name)
    .sort((a, b) => a.localeCompare(b));

  await ctx.reply(groupsNameArray.join("\n"));
});

miscComposer.command("setgroup", async (ctx) => {
  const group = await groupApi.findGroupInString(ctx.msg.text);

  if (!group) {
    await ctx.reply(ctx.t("set_group_fail"), { parse_mode: "HTML" });
    return;
  }

  ctx.session.chat.defaultGroup = group.id;
  await ctx.reply(ctx.t("set_group_success", { name: group.name }));
});

miscComposer.command("removedefault", async (ctx) => {
  if (!ctx.session.chat.defaultGroup) {
    await ctx.reply(ctx.t("remove_group_fail"));
    return;
  }

  ctx.session.chat.defaultGroup = 0;
  await ctx.reply(ctx.t("remove_group_success"));
});

export default miscComposer;
