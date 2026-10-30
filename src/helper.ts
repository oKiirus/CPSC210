/**
 *
 * @param array
 * @returns The indexes of the first duplicate values, nothing if there are none
 */
export function hasDuplicates<T>(array: T[]): number[] {
	for (let i = 0; i < array.length; i++) {
		for (let j = i + 1; j < array.length; j++) {
			if (i === j) continue;
			if (array[i] === array[j]) {
				return [i, j];
			}
		}
	}
	return [];
}
