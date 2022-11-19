import { Composer } from "telegraf";
import { admins } from "../constants";
import { chats } from "../models";
import { MyContext } from "../types/context.type";

const adminComposer = new Composer<MyContext>();

adminComposer.command("sendGlobalMessage", async (ctx) => {
  const isAdmin = admins.includes(ctx.from.id);
  if (isAdmin === false) {
    ctx.reply("Недостаточно прав");
    return;
  }

  const lastSpace = ctx.message.text.indexOf(" ");
  const args = lastSpace > 0 ? ctx.message.text.slice(lastSpace).trim() : "";
  const allChats = await chats.find();

  if (!args || ctx.message.text.indexOf(" ") === -1) return;

  allChats.forEach((chat) => {
    ctx.telegram
      .sendMessage(chat.id, args)
      .then(() => console.log(`message sended to ${chat.id}`))
      .catch(() => console.error(`can't send message to ${chat.id}`));
  });
});

export default adminComposer;
