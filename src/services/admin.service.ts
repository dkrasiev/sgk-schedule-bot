import { chatsCollection } from "../db";
import { MyContext } from "../interfaces";

export async function broadcastMessage(message: string, ctx: MyContext) {
  const chats = await chatsCollection.find().toArray();

  for (const chat of chats) {
    ctx.api.sendMessage(chat.key, message);
  }
}
