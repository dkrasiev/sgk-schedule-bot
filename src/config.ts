import dotenv from "dotenv";
dotenv.config();

const isProduction: boolean = process.env.NODE_ENV === "production";

const databaseName: string =
  (isProduction ? process.env.DB_NAME : process.env.DB_NAME_TEST) || "";

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
    uri: process.env.MONGODB_URI || "localhost",
    name: databaseName || "",
  },
};
