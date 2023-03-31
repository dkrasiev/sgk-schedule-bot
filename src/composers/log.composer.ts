import { Composer } from "grammy";
import { MyContext } from "../models/my-context.type";
import logger from "../utils/logger";

const logComposer = new Composer<MyContext>();

logComposer.on("message:text", async (ctx, next) => {
  logger.info(ctx.message.text);
  logger.info(JSON.stringify(ctx.session, undefined, 2));

  await next();
});

export default logComposer;
