import dotenv from "dotenv";
dotenv.config();

// import cron from "node-cron";

import { log } from "./utils";
import bot from "./bot";
import { chatsCollection, mongoClient } from "./db";
import { MongoSession, Schedule } from "./models";

/**
 * start app
 */
async function start() {
  bot.start();
  log("Bot has been started");

  migration();

  // update(bot);

  // cron.schedule("*/15 * * * *", () => {
  //   update(bot);
  // });
}

interface OldSchema {
  id: number;
  subscription?: {
    groupId?: number;
    lastSchedule?: Schedule;
  };
  triggers?: string[];
  defaultGroup?: number;
}

async function migration() {
  const from = mongoClient.db("test").collection<OldSchema>("chats");
  const to = chatsCollection;

  const oldUsers = await from.find().toArray();
  const newUsers = await to.find().toArray();

  console.log(oldUsers.length);
  console.log(newUsers.length);

  for (const oldUser of oldUsers) {
    if (!oldUser.id) {
      console.error("user not found");
      console.log(oldUser);
      continue;
    }

    const result = await to.findOneAndReplace(
      { key: oldUser.id.toString() },
      {
        key: oldUser.id.toString(),
        value: {
          defaultGroup: oldUser.defaultGroup ?? 0,
          triggers: oldUser.triggers ?? [],
          subscription: {
            groupId: oldUser.subscription?.groupId ?? 0,
            lastSchedule: oldUser.subscription?.lastSchedule ?? undefined,
          },
        } as MongoSession,
      },
      {
        returnDocument: "after",
        upsert: true,
      }
    );

    if (result.value?.key) {
      console.log(result.value.value);
    }
  }

  console.log(oldUsers[0]);
  console.log(newUsers[0]);
}

start();
