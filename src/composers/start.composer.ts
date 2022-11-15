import { Composer, InlineKeyboard } from "grammy";
import { MyContext } from "../types/context.type";

const startComposer = new Composer<MyContext>();

startComposer.command("start", async (ctx) => {
  if (ctx.from == null) return;

  const name = ctx.from.last_name
    ? `${ctx.from.last_name} ${ctx.from.first_name}`
    : ctx.from.first_name;

  await ctx.reply(ctx.t("welcome", { name }));
});

startComposer.command("help", async (ctx) => {
  await ctx.reply(ctx.t("help"), {
    reply_markup: new InlineKeyboard().url(
      "По возникшим вопросам можно написать сюда",
      "https://t.me/dkrasiev"
    ),
    parse_mode: "MarkdownV2",
  });
});

export default startComposer;
