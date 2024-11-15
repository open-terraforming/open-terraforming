/**
 * Returns length of string without special characters
 * @param str
 */

export const nonEmptyStringLength = (str?: string) => str ? str.replace(/[\x00-\x08\x0E-\x1F\x7F-\uFFFF ]/g, '').length : 0;
