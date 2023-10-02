import { I18nFlavor } from "@grammyjs/i18n";
import { Context, SessionFlavor } from "grammy";

import { ScheduleEntity } from "./entities/schedule-entity.class";
import { MySession } from "./my-session.interface";

export interface MyFlavor {
  getDefault(): ScheduleEntity | undefined;
}

export type MyContext = Context &
  I18nFlavor &
  SessionFlavor<MySession> &
  MyFlavor;
