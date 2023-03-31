import { Context, SessionFlavor } from "grammy";
import { I18nFlavor } from "@grammyjs/i18n";
import { MySession } from "./my-session.interface";
import { ScheduleEntity } from "./schedule-entity.class";

export interface MyFlavor {
  getDefault(): ScheduleEntity | undefined;
}

export type MyContext = Context &
  I18nFlavor &
  SessionFlavor<MySession> &
  MyFlavor;
