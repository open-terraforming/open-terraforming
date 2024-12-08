/**
 * Simplified version of mentioned package
 * @source https://github.com/busterc/contrast-color
 */

const isValidColor = (color: string) => {
	if (color.length !== 4 && color.length !== 7) {
		return false
	}

	if (!color.startsWith('#')) {
		return false
	}

	if (!color.slice(1).match(/^[0-9A-Fa-f]+$/)) {
		return false
	}

	return true
}

const assertValidColor = (color: string) => {
	if (!isValidColor(color)) {
		throw new TypeError(`Invalid color: ${color}`)
	}
}

export function contrastColor({
	bgColor = '#FFFFFF',
	fgDarkColor = '#000000',
	fgLightColor = '#FFFFFF',
	defaultColor = '#000000',
	threshold = 128,
} = {}) {
	// We accept invalid bg colors and just return the default value in that case
	if (!isValidColor(bgColor)) {
		console.warn(`Invalid bgColor: ${bgColor}`)

		return defaultColor
	}

	assertValidColor(fgDarkColor)
	assertValidColor(fgLightColor)
	assertValidColor(defaultColor)

	let bgColorArray = String(bgColor).toUpperCase().split('').slice(1)

	switch (bgColorArray.length) {
		case 3:
		case 4:
			// 3 e.g. #FFF
			// 4 e.g. #1234 <- (3hex + alpha-channel)
			bgColorArray = bgColorArray.slice(0, 3).map((c) => `${c}${c}`)
			break
		case 6:
		case 8:
			// 6 e.g. #789ABC <- ideal
			// 8 e.g. #789ABC00 <- (6hex + alpha-channel)
			bgColorArray = bgColorArray
				.slice(0, 6)
				.reduce(
					(acc, curr, n, arr) =>
						n % 2 ? [...acc, `${arr[n - 1]}${curr}`] : acc,
					[] as string[],
				)

			break
		default:
			// Invalid bgColor value, so you get the default
			return defaultColor
	}

	const [r, g, b] = bgColorArray.map((h) => parseInt(h, 16))
	const yiq = (r * 299 + g * 587 + b * 114) / 1000
	const darkOrLight = yiq >= threshold ? fgDarkColor : fgLightColor

	return darkOrLight
}
