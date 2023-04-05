import cronparser from "cron-parser";
import dayjs from "dayjs";
import cron from "node-cron";
import humanizeDuration from "humanize-duration";

import { MessageCounterService } from "./message-counter.service";
import logger from "../utils/logger";

export class LoadWatchService {
  private duration: string;

  constructor(
    private counter: MessageCounterService,
    private cronExpression = "*/60 * * * *" // every hour by default
  ) {
    const parsedCronExpression = cronparser.parseExpression(
      this.cronExpression
    );

    const prev = dayjs(parsedCronExpression.prev().toDate());
    const next = dayjs(parsedCronExpression.next().toDate());
    const ms = next.diff(prev, "ms");

    this.duration = humanizeDuration(ms);

    cron.schedule(this.cronExpression, () => {
      logger.info(
        `In ${this.duration} got ${this.counter.getCount()} messages`
      );

      this.counter.reset();
    });
  }
}
