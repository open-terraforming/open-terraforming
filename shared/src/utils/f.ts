// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const f = (s: string, ...args: (string | number)[]) =>
	args.reduce((s: string, a, i) => s.replace(`{${i}}`, String(a)), s)
