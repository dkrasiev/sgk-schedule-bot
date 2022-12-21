import { chatsCollection } from "../db";
import { MyContext } from "../interfaces";

export class AdminService {
  async broadcastMessage(message: string, ctx: MyContext) {
    const chats = await chatsCollection.find().toArray();

    for (const chat of chats) {
      ctx.api.sendMessage(chat.key, message, { parse_mode: "HTML" });
    }
  }
}

export const adminService = new AdminService();
