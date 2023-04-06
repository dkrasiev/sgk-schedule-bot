import { MY_WHITESPACE } from "./regex";

/**
 * remove "/command" from a string
 * @param {string} text Input text
 * @returns Array of arguments after "/command"
 */
export function getArguments(text: string): string[] {
  return text
    .trim()
    .replace(/-/g, "")
    .toLowerCase()
    .split(MY_WHITESPACE)
    .filter(Boolean);
}
