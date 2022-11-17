import dayjs from "dayjs";

/**
 * Send console.log with concatenated time
 * @param {unknown} message Message to pass to console.log
 * @param {string} timeFormat Date format for dayjs
 */
export function log(message: unknown, timeFormat = "HH:mm:ss") {
  const time = `[${dayjs().format(timeFormat)}]`;

  const log: string =
    typeof message === "string"
      ? message
      : JSON.stringify(message, undefined, 2);

  console.log([time, log].join(log.includes("\n") ? "\n" : " "));
}
