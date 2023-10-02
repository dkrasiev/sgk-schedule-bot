import { ADMINS } from "../../../config/config";

export function isAdmin(username?: string): boolean {
  return username ? ADMINS.includes(username) : false;
}
