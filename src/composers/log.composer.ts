import { Composer } from "grammy";

import logger from "../config/logger";
import { MyContext } from "../modules/common";
import { counter } from "../services/singleton-services";

const logComposer = new Composer<MyContext>();

logComposer.on("message:text", async (ctx, next) => {
  logger.info(ctx.message.text);

  counter.count();
  logger.info(JSON.stringify(ctx.session, undefined, 2));

  await next();
});

export default logComposer;
