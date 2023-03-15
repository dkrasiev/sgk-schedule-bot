import { GROUP_REGEX, QUERY_ARGUMENT } from "./regex";

/**
 * remove "/command" from a string
 * @param {string} text Input text
 * @returns Text after "/command"
 */
export function getArgument(text: string): string {
  let query = text;

  console.log(query);

  const regexMatch = QUERY_ARGUMENT.exec(query);
  if (regexMatch) {
    console.log(regexMatch);
    query = regexMatch[2] || "";
  }

  // const groupRegexMatch = GROUP_REGEX.exec(text);
  // if (groupRegexMatch) {
  //   query = groupRegexMatch.slice(1).join("-");
  // }

  return query.trim().toLowerCase();
}
