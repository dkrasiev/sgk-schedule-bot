import { ADMINS } from "../config";

export function isAdmin(username?: string): boolean {
  if (!username) return false;

  return ADMINS.includes(username);
}
