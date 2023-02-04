import { sessions } from "../database";
import logger from "../helpers/logger";
import { MyContext } from "../models/my-context.type";

export class AdminService {
  async broadcastMessage(message: string, ctx: MyContext) {
    const chats = await sessions.find().toArray();

    for (const chat of chats) {
      ctx.api
        .sendMessage(chat.key, message, { parse_mode: "HTML" })
        .catch(logger.error);
    }
  }
}

export const adminService = new AdminService();
