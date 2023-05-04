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

export const DB_URI = process.env.DB_URI || "localhost";
export const DB_NAME =
  (PRODUCTION ? process.env.DB_NAME : process.env.DB_NAME_TEST) ||
  "schedule_bot";

export const BOT_MODE = process.env.BOT_MODE;
