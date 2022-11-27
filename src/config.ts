export const config = {
  groupsApi: "https://mfc.samgk.ru/api/groups",
  scheduleApi: "http://asu.samgk.ru/api/schedule",
  teachersApi: "http://asu.samgk.ru/api/teachers",
  cabsApi: "http://asu.samgk.ru/api/cabs",
  isProduction: process.env.NODE_ENV === "production",
  admins: [748299957],
};
