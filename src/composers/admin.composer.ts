import { Composer } from "grammy";

import { MyContext } from "../models/my-context.type";
import { adminService } from "../services/admin.service";
import { isAdmin } from "../utils/is-admin";

const adminComposer = new Composer<MyContext>();

adminComposer.command("broadcast", async (ctx, next) => {
  if (isAdmin(ctx.from?.username) === false) {
    await next();
    return;
  }

  if (!ctx.message?.text) {
    await ctx.reply("Text not found");
    return;
  }

  const message = ctx.message.text.slice(ctx.message.text.indexOf(" ") || 0);
  if (!message) {
    await ctx.reply("Message not found");
    return;
  }

  await adminService.broadcastMessage(message, ctx);
});

export default adminComposer;
