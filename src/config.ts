export interface IConfig {
  groupApi: string;
  scheduleApi: string;
  isProduction: boolean;
}

export const config: IConfig = {
  groupApi: "https://mfc.samgk.ru/api/groups",
  scheduleApi: "http://asu.samgk.ru//api/schedule",
  isProduction: process.env.NODE_ENV === "production",
};
