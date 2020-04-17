export const wait = (timeoutInMs: number) =>
	new Promise(resolve => setTimeout(resolve, timeoutInMs))
