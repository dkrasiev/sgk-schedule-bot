import { Context, SessionFlavor } from "grammy";
import { I18nFlavor } from "@grammyjs/i18n";
import { ChatDocument } from "../models/chat.model";

export interface MySession {
  chat: ChatDocument;
}

export type MyContext = Context & I18nFlavor & SessionFlavor<MySession>;
