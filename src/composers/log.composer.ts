import { Composer } from "grammy";
import { log } from "../utils";
import { MyContext } from "../interfaces/context.interface";

const logComposer = new Composer<MyContext>();

logComposer.on("message:text", async (ctx, next) => {
  log(ctx.message.text);

  await next();
});

export default logComposer;
