import { AdminService } from "./admin.service";
import { FinderService } from "./finder.service";
import { MessageCounterService } from "./message-counter.service";
import { SGKApiService } from "./sgk-api.service";

export const sgkApi = new SGKApiService();
export const finder = new FinderService(sgkApi);
export const counter = new MessageCounterService();
export const admin = new AdminService();
