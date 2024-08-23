// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const assertNever = (x: never): never => {
	throw new Error('Unexpected ' + x)
}
