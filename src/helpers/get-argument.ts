/**
 *
 * @param {string} text Input text
 * @returns Text after command
 */
export const getArgument = (text: string): string => {
  const spaceIndex = text.trim().indexOf(" ");

  return text
    .slice(spaceIndex)
    .split(" ")
    .map((v) => v.trim())
    .filter((v) => v)
    .join(" ");
};
