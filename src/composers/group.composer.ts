// import { Composer } from "grammy";
// import { getGroupFromString } from "../utils";
// import { MyContext } from "../models/context.interface";

// const groupComposer = new Composer<MyContext>();

// groupComposer.on("message:text", async (ctx, next) => {
//   const groupFromMessage = await getGroupFromString(ctx.message.text);
//   const groupFromChat = await groups.findOne({ id: chat.defaultGroup });

//   ctx.session.group = groupFromMessage || groupFromChat || undefined;
//   ctx.session.messageHasGroup = !!groupFromMessage;

//   await next();
// });

// export default groupComposer;
