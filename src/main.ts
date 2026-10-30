import { err, ok, Result } from "./result.ts";
import { Class, Day, Period, Schedule, Section, SectionGroup } from "./classes.ts";



export function doPeriodsOverlap(periods: Period[]): boolean {
	for (const periodA of periods) {
		for (const periodB of periods) {
			if (periodA === periodB) continue;
			if (periodA.checkOverlap(periodB)) {
				return true;
			}
		}
	}
	return false;
}

export function doSectionsOverlap(sections: Section[]): boolean {
	for (const sectionA of sections) {
		for (const sectionB of sections) {
			if (sectionA === sectionB) continue;
			if (sectionA.checkOverlap(sectionB)) {
				return true;
			}
		}
	}
	return false;
}

/**
 *
 * @param indexArray The array of indexes to be increased by one, like binary 0101 -> 0110
 * @param maxIndexes An array that controlls the highest number for each place, if maxes is 2321, then 2221 -> 2300
 * @returns If there is overflow the function returns true, false otherwise
 */
function stepIndexArray(indexArray: number[], maxIndexes: number[]): boolean {
	for (let i = 0; i < indexArray.length; i++) {
		if (indexArray[i] === maxIndexes[i]) {
			indexArray[i] = 0;
			continue;
		} else {
			indexArray[i] += 1;
			return false;
		}
	}
	return true;
}



export function getPossibleSchedules(classes: Class[]): Schedule[] {
	const possibleSchedules: Schedule[] = [];

	const allSectionGroups: SectionGroup[] = [];

	const sectionGroupIndexes: number[] = new Array(allSectionGroups.length).fill(0);
	const maxSectionGroupIndexes: number[] = allSectionGroups.map((group: SectionGroup) => group.sections.length);

	do {
		const sectionsAttempt: Section[] = [];

		for (let i = 0; i < allSectionGroups.length; i++) {
			const group: SectionGroup = allSectionGroups[i];
			sectionsAttempt.push(group.sections[sectionGroupIndexes[i]]);
		}

		if (!doSectionsOverlap(sectionsAttempt)) {
			const possibleSchedule: Schedule = new Schedule();
			for (const cl of classes) {
				const classSections: Section[] = sectionsAttempt.filter(
					(section: Section) => section.className === cl.description.name,
				);
				possibleSchedule.addClass(cl, classSections);
			}
			possibleSchedules.push(possibleSchedule);
		}
	} while (stepIndexArray(sectionGroupIndexes, maxSectionGroupIndexes));

	return possibleSchedules;
}
