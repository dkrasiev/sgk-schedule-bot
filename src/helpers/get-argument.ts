/**
 *
 * @param {string} text Input text
 * @returns Text after command
 */
export const getArgument = (text: string): string => {
  try {
    const spaceIndex = text.trim().indexOf(" ");

    return text
      .slice(spaceIndex)
      .split(" ")
      .map((v) => v.trim())
      .filter((v) => v)
      .join(" ");
  } catch {
    return "";
  }
};
