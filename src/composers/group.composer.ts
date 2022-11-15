import { Composer } from "telegraf";
import { getGroupFromString } from "../utils";
import { chats, groups } from "../models";
import { MyContext } from "../types/context.type";

const groupComposer = new Composer<MyContext>();

groupComposer.on("text", async (ctx, next) => {
  const chat = await chats.findOne({ id: ctx.chat.id });
  if (!chat) return;

  const groupFromMessage = await getGroupFromString(ctx.message.text);
  const groupFromChat = await groups.findOne({ id: chat.defaultGroup });

  ctx.state.group = groupFromMessage || groupFromChat || undefined;
  ctx.state.messageHasGroup = !!groupFromMessage;

  next();
});

export default groupComposer;
