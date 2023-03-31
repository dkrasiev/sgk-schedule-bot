import { QUERY_ARGUMENT } from "./regex";

/**
 * remove "/command" from a string
 * @param {string} text Input text
 * @returns Text without "/command"
 */
export function trimCommand(text: string): string {
  const regexMatch = QUERY_ARGUMENT.exec(text);
  if (regexMatch) {
    text = regexMatch[2] || "";
  }

  return text.trim();
}
