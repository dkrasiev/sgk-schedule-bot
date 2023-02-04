import { Context, SessionFlavor } from "grammy";
import { I18nFlavor } from "@grammyjs/i18n";
import { MySession } from "./my-session.interface";

export type MyContext = Context & I18nFlavor & SessionFlavor<MySession>;
