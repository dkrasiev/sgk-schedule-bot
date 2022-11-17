import { Context, SessionFlavor } from "grammy";
import { I18nFlavor } from "@grammyjs/i18n";
import { Schedule } from "./schedule.interface";

export interface Subscription {
  groupId: number;
  lastSchedule?: Schedule;
}

export interface SessionData {
  chat: {
    defaultGroup: number;
    triggers: string[];
    subscription: Subscription;
  };
  message: {
    groupId?: number;
  };
}

export type MyContext = Context & I18nFlavor & SessionFlavor<SessionData>;
