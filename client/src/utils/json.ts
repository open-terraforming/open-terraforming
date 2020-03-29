// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const tryParseJSON = <T = any>(data: string | null): T | null => {
	try {
		return data ? JSON.parse(data) : null
	} catch (e) {
		return null
	}
}
