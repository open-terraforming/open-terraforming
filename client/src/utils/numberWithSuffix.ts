export const numberWithSuffix = (input: number) => {
	if (input === 1) {
		return '1st'
	}

	if (input === 2) {
		return '2nd'
	}

	if (input === 3) {
		return '3rd'
	}

	return `${input}th`
}
