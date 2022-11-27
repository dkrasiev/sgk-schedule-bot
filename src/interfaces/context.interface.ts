import { Context, SessionFlavor } from "grammy";
import { I18nFlavor } from "@grammyjs/i18n";

export interface MongoSession {
  defaultGroup: number;
  triggers: string[];
  subscribedGroup: number;
}

export type MyContext = Context & I18nFlavor & SessionFlavor<MongoSession>;
