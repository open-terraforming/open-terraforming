// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const f = (s: string, ...args: any[]) =>
	args.reduce(
		(s, a, i) =>
			s.replace(
				`{${i}}`,
				typeof a === 'object' && typeof a.toString === 'function'
					? a.toString()
					: a
			),
		s
	)
