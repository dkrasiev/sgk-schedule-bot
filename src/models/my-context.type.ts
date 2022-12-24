import { Context, SessionFlavor } from "grammy";
import { I18nFlavor } from "@grammyjs/i18n";
import { MongoSession } from "./mongo-session.interface";

export type MyContext = Context & I18nFlavor & SessionFlavor<MongoSession>;
