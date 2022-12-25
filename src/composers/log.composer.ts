import { Composer } from "grammy";
import { MyContext } from "../models/my-context.type";
import logger from "../helpers/logger";

const logComposer = new Composer<MyContext>();

logComposer.on("message:text", async (ctx, next) => {
  logger.info(ctx.message.text);

  await next();
});

export default logComposer;
