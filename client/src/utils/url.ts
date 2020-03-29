export const joinUrl = (...parts: string[]) =>
	parts
		.map((p, i) => (i == 0 ? p : p.replace(/^\/+/, '')).replace(/\/+$/, ''))
		.join('/')
