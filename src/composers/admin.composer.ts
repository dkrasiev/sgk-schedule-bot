import { Composer } from "grammy";

import { MyContext } from "../interfaces";
import { config } from "../config";
import { getArgument } from "../helpers/get-argument";
import { adminService } from "../services/admin.service";

const adminComposer = new Composer<MyContext>();

adminComposer.command("broadcast", async (ctx, next) => {
  const isAdmin = ctx.from?.id && config.admins.includes(ctx.from.id);
  if (!isAdmin) {
    await next();
    return;
  }

  const message = ctx.message?.text && getArgument(ctx.message.text);
  if (!message) {
    ctx.reply("Messages not found");

    return;
  }

  await adminService.broadcastMessage(message, ctx);
  await ctx.reply("Messages sent");
});

export default adminComposer;
