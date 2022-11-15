import { Bot, session } from "grammy";
import { I18n } from "@grammyjs/i18n";
import { ISession, MongoDBAdapter } from "@grammyjs/storage-mongodb";
import { MongoClient } from "mongodb";

import path from "path";

import { botCommands } from "./constants";
import { MyContext } from "./types/context.type";
import startComposer from "./composers/start.composer";

const isProduction = process.env.NODE_ENV === "production";
const token = isProduction ? process.env.BOT_TOKEN : process.env.BOT_TOKEN_TEST;

if (!token) {
  throw new Error("Bot token is required");
}

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI required");
}

const client = new MongoClient(process.env.MONGODB_URI);
client.connect();
const db = client.db("test");
const collection = db.collection<ISession>("users");

const bot = new Bot<MyContext>(token);

const i18n = new I18n({
  defaultLocale: "ru",
  useSession: true,
  directory: path.resolve(__dirname, "locales"),
});

bot.api.setMyCommands(botCommands);

bot.use(i18n);

bot.use(
  session({
    storage: new MongoDBAdapter({ collection }),
  })
);

bot.use(startComposer);

export default bot;
