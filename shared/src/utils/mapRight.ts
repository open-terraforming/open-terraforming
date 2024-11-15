import { voidReduceRight } from "./voidReduceRight";


export const mapRight = <T, R>(
	array: T[],
	callback: (item: T, index: number) => R
): R[] => voidReduceRight(array, [] as R[], (acc, item, index) => acc.push(callback(item, index))
);
