import { range } from './collections'

const PASSWORD_CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789'

export const randomPassword = (length: number, chars = PASSWORD_CHARS) =>
	range(0, 10)
		.map(() =>
			PASSWORD_CHARS.charAt(
				Math.round(Math.random() * (PASSWORD_CHARS.length - 1))
			)
		)
		.map(c => (Math.random() > 0.5 ? c.toUpperCase() : c))
		.join('')
