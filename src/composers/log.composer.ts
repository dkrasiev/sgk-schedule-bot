import {Composer} from 'telegraf';
import {log} from '../utils';
import {MyContext} from '../types/context.type';

const logComposer = new Composer<MyContext>();

logComposer.on('text', async (ctx, next) => {
  log(ctx.message.text);

  next();
});

export default logComposer;
