import { Composer, InlineKeyboard } from "grammy";
import { MyContext } from "../interfaces/context.interface";

const startComposer = new Composer<MyContext>();

startComposer.command("start", async (ctx) => {
  if (ctx.from == null) return;

  await ctx.reply(ctx.t("welcome", { name: ctx.from.first_name }));
});

startComposer.command("help", async (ctx) => {
  await ctx.reply(ctx.t("help"), {
    reply_markup: new InlineKeyboard().url(
      "По возникшим вопросам можно написать сюда",
      "https://t.me/dkrasiev"
    ),
    parse_mode: "HTML",
  });
});

export default startComposer;
