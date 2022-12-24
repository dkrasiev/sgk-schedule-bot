import { Composer } from "grammy";

import { MyContext } from "../models/my-context.type";
import { getArgument } from "../helpers/get-argument";
import { adminService } from "../services/admin.service";
import { isAdmin } from "../helpers/is-admin";

const adminComposer = new Composer<MyContext>();

adminComposer.command("broadcast", async (ctx, next) => {
  if (isAdmin(ctx.from?.username) === false) {
    await next();
    return;
  }

  const message = ctx.message?.text && getArgument(ctx.message.text);
  if (!message) {
    ctx.reply("Message not found");

    return;
  }

  await adminService.broadcastMessage(message, ctx);
  await ctx.reply("Messages sent");
});

export default adminComposer;
