import dotenv from "dotenv";
dotenv.config();

const {
  NODE_ENV,
  DB_NAME,
  DB_NAME_TEST,
  MONGODB_URI,
  BOT_TOKEN,
  BOT_TOKEN_TEST,
} = process.env;

const isProduction: boolean = NODE_ENV === "production";

export const config = {
  api: {
    groups: "https://mfc.samgk.ru/api/groups",
    schedule: "http://asu.samgk.ru/api/schedule",
    teachers: "http://asu.samgk.ru/api/teachers",
    cabinets: "http://asu.samgk.ru/api/cabs",
  },
  dateFormat: "YYYY-MM-DD",
  isProduction,
  admins: ["dkrasiev"],
  database: {
    uri: MONGODB_URI || "localhost",
    name: isProduction ? DB_NAME : DB_NAME_TEST,
  },
  botToken: isProduction ? BOT_TOKEN : BOT_TOKEN_TEST,
};
