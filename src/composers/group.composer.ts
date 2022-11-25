import { Composer } from "grammy";
import { groupService } from "../services/group.service";
import { MyContext } from "../interfaces/context.interface";

const groupComposer = new Composer<MyContext>();

groupComposer.on("message:text", async (ctx, next) => {
  const groupFromMessage = await groupService.findGroupInString(
    ctx.message.text
  );

  ctx.session.message.groupId = groupFromMessage?.id;

  await next();
});

export default groupComposer;
