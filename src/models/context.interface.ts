import { Context, SessionFlavor } from "grammy";
import { I18nFlavor } from "@grammyjs/i18n";
import { Schedule } from "./schedule.interface";

export interface Subscription {
  groupId: number;
  lastSchedule?: Schedule;
}

export interface SessionData {
  defaultGroup: number;
  triggers: string[];
  subscription: Subscription;
}

export type MyContext = Context & I18nFlavor & SessionFlavor<SessionData>;
