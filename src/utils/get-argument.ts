import { QUERY_ARGUMENT } from "./regex";

/**
 * remove "/command" from a string
 * @param {string} text Input text
 * @returns Text after "/command"
 */
export function getArgument(text: string): string {
  let query = text;

  const regexMatch = QUERY_ARGUMENT.exec(query);
  if (regexMatch) {
    query = regexMatch[2] || "";
  }

  return query.trim().toLowerCase();
}
