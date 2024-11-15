/**
 * Generates array containing numbers between start and end (excluding).
 * @param start beginning number
 * @param end ending number (excluding)
 * @param step range step, defaults to 1
 */

export function range(start: number, end: number, step = 1) {
	const result = [] as number[];

	for (let i = start; i < end; i += step) {
		result.push(i);
	}

	return result;
}
