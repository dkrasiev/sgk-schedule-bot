import { Composer } from "grammy";

import { MyContext } from "../models/my-context.type";
import { getArgument } from "../utils/get-argument";
import { finder } from "../services/finder.service";

const miscComposer = new Composer<MyContext>();

miscComposer.command("search", async (ctx) => {
  const result = finder.searchFromContext(ctx);

  if (result.length === 0) {
    await ctx.reply(ctx.t("search_not_found"));
    return;
  }

  try {
    await ctx.reply(
      ctx.t("search_found", {
        list: result.map((entity) => entity.name).join("\n"),
      })
    );
  } catch (error) {
    await ctx.reply(ctx.t("search_too_many"));
  }
});

miscComposer.command("setdefault", async (ctx) => {
  const argument = getArgument(ctx.message?.text ?? "");
  console.log(argument);
  if (!argument) {
    await ctx.reply(ctx.t("set_default_fail"), { parse_mode: "HTML" });
    return;
  }

  const entity = finder.searchFromContext(ctx)[0];

  if (entity) {
    ctx.session.default = entity.id;
    await ctx.reply(ctx.t("set_default_success", { name: entity.name }));
    return;
  }

  await ctx.reply(ctx.t("set_default_not_found"));
});

miscComposer.command("removedefault", async (ctx) => {
  if (ctx.session.default) {
    ctx.session.default = undefined;
    await ctx.reply(ctx.t("remove_group_success"));
    return;
  }

  await ctx.reply(ctx.t("remove_group_fail"));
});

export default miscComposer;
