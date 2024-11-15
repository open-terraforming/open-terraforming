
export const flatten = <T>(a: T[][]) => a.reduce((acc, a) => [...acc, ...a], [] as T[]);
