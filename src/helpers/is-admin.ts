import { config } from "../config";

export function isAdmin(username?: string): boolean {
  if (!username) return false;

  return config.admins.includes(username);
}
