/**
 * remove "/command" from a string
 * @param {string} text Input text
 * @returns Text without "/command"
 */
export function trimCommand(text: string): string {
  return text.replace(/(^\/\S*)/, '').trim()
}
