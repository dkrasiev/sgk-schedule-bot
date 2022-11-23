import { Composer } from "grammy";
import { groupApi } from "../utils/groups-api";
import { MyContext } from "../interfaces/context.interface";

const groupComposer = new Composer<MyContext>();

groupComposer.on("message:text", async (ctx, next) => {
  const groupFromMessage = await groupApi.findGroupInString(ctx.message.text);

  ctx.session.message.groupId = groupFromMessage?.id;

  await next();
});

export default groupComposer;
