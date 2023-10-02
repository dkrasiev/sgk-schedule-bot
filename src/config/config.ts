import dotenv from "dotenv";
dotenv.config();

export const PRODUCTION = process.env.NODE_ENV === "production";

export const SCHEDULE_URL = "http://asu.samgk.ru/api/schedule";

export const GROUPS_URL = "https://mfc.samgk.ru/api/groups";
export const TEACHERS_URL = "http://asu.samgk.ru/api/teachers";
export const CABINETS_URL = "http://asu.samgk.ru/api/cabs";

export const ADMINS = ["dkrasiev"];
export const DATE_FORMAT = "YYYY-MM-DD";
export const BOT_TOKEN = PRODUCTION
  ? process.env.BOT_TOKEN
  : process.env.BOT_TOKEN_TEST;

export const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost";
export const MONGODB_NAME =
  (PRODUCTION ? process.env.MONGODB_NAME : process.env.MONGODB_NAME_TEST) ||
  "schedule_bot";

export const REDIS_URI = process.env.REDIS_URI || "redis://localhost";

export const SCHEDULE_CHECKER = process.env.BOT_MODE === "schedule-checker";

export default {
  PRODUCTION,

  SCHEDULE_URL,

  GROUPS_URL,
  TEACHERS_URL,
  CABINETS_URL,

  ADMINS,
  DATE_FORMAT,
  BOT_TOKEN,

  MONGODB_URI,
  MONGODB_NAME,

  REDIS_URI,

  SCHEDULE_CHECKER,
};
