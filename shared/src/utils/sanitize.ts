/**
 * Removes control characters from input string
 * @param str
 */

export const sanitize = (str?: string) => str ? str.trim().replace(/[\x00-\x1F\x7F-\x9F\u200f]/g, '') : str;
