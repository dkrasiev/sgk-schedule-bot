import { Composer } from "grammy";
import { getGroupFromString } from "../utils/groups";
import { MyContext } from "../interfaces/context.interface";

const groupComposer = new Composer<MyContext>();

groupComposer.on("message:text", async (ctx, next) => {
  const groupFromMessage = await getGroupFromString(ctx.message.text);

  ctx.session.message.groupId = groupFromMessage?.id;

  await next();
});

export default groupComposer;
