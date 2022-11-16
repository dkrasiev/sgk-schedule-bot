import { Composer } from "grammy";
import { log } from "../utils";
import { MyContext } from "../models/context.interface";

const logComposer = new Composer<MyContext>();

logComposer.on("message:text", async (ctx, next) => {
  log(ctx.msg.text);

  await next();
});

export default logComposer;
