import { ISession } from "@grammyjs/storage-mongodb";
import { sessions } from "../database";
import { MyContext } from "../models/my-context.type";

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
    }, 5000);

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
            })
      ),
      50
    );

    clearInterval(timer);

    await ctx.reply(
      `complete\n${successMessages} sended\n${failMessages} failed`
    );
  }
}

async function runSequentialWithDelay<T>(
  promises: (() => Promise<T>)[],
  delay: number
): Promise<T[]> {
  const results: T[] = [];

  for (const promise of promises) {
    await wait(delay);
    results.push(await promise());
  }

  return results;
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const adminService = new AdminService();
