import { chatsCollection, connection } from "../db";
import { MongoSession, Schedule } from "../interfaces";
import { log } from "./log";

interface OldSchema {
  id: number;
  subscription?: {
    groupId?: number;
    lastSchedule?: Schedule;
  };
  triggers?: string[];
  defaultGroup?: number;
}

export async function migration() {
  if (process.env.MONGODB_URI === undefined)
    throw new Error("mongodb uri not found");

  const from = connection.db("test").collection<OldSchema>("chats");
  const to = chatsCollection;

  const oldUsers = from.find();

  console.log(await from.countDocuments());
  console.log(await to.countDocuments());

  while (await oldUsers.hasNext()) {
    const oldUser = await oldUsers.next();

    if (oldUser?.id === undefined) {
      console.error("user not found");
      console.log(oldUser);
      continue;
    }

    const result = await to.findOneAndUpdate(
      { key: oldUser.id.toString() },
      {
        $set: {
          key: oldUser.id.toString(),
          value: {
            defaultGroup: oldUser.defaultGroup ?? 0,
            triggers: oldUser.triggers ?? [],
            subscribedGroup: oldUser.subscription?.groupId
              ? oldUser.subscription.groupId
              : 0,
          } as MongoSession,
        },
      },
      {
        returnDocument: "after",
        upsert: true,
      }
    );

    if (result.value?.key) {
      log(result.value);
    }
  }
}
