// import { sessions } from "../database";
import logger from "../utils/logger";
import { MyContext } from "../models/my-context.type";

export class AdminService {
  async broadcastMessage(message: string, ctx: MyContext) {
    // const chats = await sessions.find().toArray();
    // for (const chat of chats) {
    //   ctx.api.sendMessage(chat.key, message).catch(logger.error);
    // }
  }
}

export const adminService = new AdminService();
