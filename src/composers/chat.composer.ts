// import { Composer } from "telegraf";
// import { MyContext } from "../models/context.interface";
// import { chats } from "../models";

// const chatComposer = new Composer<MyContext>();

// chatComposer.on("message", async (ctx, next) => {
//   let chat = await chats.findOne({ id: ctx.chat.id });
//   if (chat == null) {
//     chat = await chats.create({ id: ctx.chat.id });
//   }

//   ctx.state.chat = chat;

//   await next();
// });

// export default chatComposer;
