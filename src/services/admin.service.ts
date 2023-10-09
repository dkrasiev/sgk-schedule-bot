import { ISession } from "@grammyjs/storage-mongodb";

import { sessions } from "../config/database";
import { MyContext, runSequentialWithDelay } from "../modules/common";

export class AdminService {
  async broadcastMessage(message: string, ctx: MyContext) {
    const chats = await sessions
      .find()
      .toArray()
      .then((chats) => new Array(100).fill(chats[0]) as ISession[]);

    let successMessages = 0;
    let failMessages = 0;
    const timer = setInterval(() => {
      ctx.reply(`${successMessages}/${chats.length} sended`);
    }, 1000);

    await runSequentialWithDelay(
      chats.map(
        (chat) => () =>
          ctx.api
            .sendMessage(chat.key, message)
            .then(() => {
              successMessages++;
              return true;
            })
            .catch(() => {
              failMessages++;
              return false;
            }),
      ),
      50,
    );

    clearInterval(timer);

    await ctx.reply(
      `complete\n${successMessages} sended\n${failMessages} failed`,
    );
  }
}
