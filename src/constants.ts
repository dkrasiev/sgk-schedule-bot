import { Collection } from "./interfaces/collection.interface";

export const isProduction: boolean = process.env.NODE_ENV === "production";

export const groupsApi = "https://mfc.samgk.ru/api/groups";

export const groupRegex = new RegExp(/([А-я]{1,3})[\W]?(\d{2})[\W]?(\d{2})/);

export const times: Collection<string> = {
  "1": "08:25-10:00",
  "2": "10:10-11:45",
  "3": "12:15-13:50",
  "4": "14:00-15:35",
  "5": "15:45-17:20",
  "6": "17:30-19:05",
  "7": "19:15-20:50",
  "1.1": "08:25-09:10",
  "1.2": "09:15-10:00",
  "2.1": "10:10-10:55",
  "2.2": "11:00-11:45",
  "3.1": "12:15-13:00",
  "3.2": "13:05-13:50",
  "4.1": "14:00-14:45",
  "4.2": "14:50-15:35",
  "5.1": "15:45-16:30",
  "5.2": "16:35-17:20",
  "6.1": "17:30-18:15",
  "6.2": "18:20-19:05",
  "7.1": "19:15-20:00",
  "7.2": "20:05-20:50",
};

export const mondayTimes: Collection<string> = {
  "1": "09:15-10:55",
  "2": "11:00-13:00",
  "3": "13:05-14:45",
  "4": "14:50-16:30",
  "5": "16:35-18:15",
  "6": "18:20-20:00",
  "7": "20:05-21:45",
  "1.1": "09:15-10:00",
  "1.2": "10:10-10:55",
  "2.1": "11:00-11:45",
  "2.2": "12:15-13:00",
  "3.1": "13:05-13:50",
  "3.2": "14:00-14:45",
  "4.1": "14:50-15:35",
  "4.2": "15:45-16:30",
  "5.1": "16:35-17:20",
  "5.2": "17:30-18:15",
  "6.1": "18:20-19:05",
  "6.2": "19:15-20:00",
  "7.1": "20:05-20:50",
  "7.2": "21:00-21:45",
};

export const botCommands = [
  { command: "help", description: "Помощь" },
  { command: "schedule", description: "Расписание на два дня" },
  { command: "today", description: "Расписание на сегодня" },
  { command: "tomorrow", description: "Расписание на завтра" },
  { command: "trigger", description: "Добавить или удалить триггер" },
  { command: "groups", description: "Показать все группы" },
  { command: "setgroup", description: "Выбрать группу по умолчанию" },
  { command: "removedefault", description: "Удалить группу по умолчанию" },
  { command: "subscribe", description: "Подписаться на обновления расписания" },
  {
    command: "unsubscribe",
    description: "Отписаться от обновлений расписания",
  },
];
