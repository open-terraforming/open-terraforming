export const quantized = (input: number, singular: string, plural: string) => {
	if (input === 1 || input === -1) {
		return `${input} ${singular}`
	}

	return `${input} ${plural}`
}
