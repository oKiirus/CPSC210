import { makeClass, makePeriod } from "./constructors.ts";
import { err, ok, Result } from "./result.ts";
import { Class, Day, Period, Schedule, Section, SectionGroup } from "./types.ts";

type Conflict = { periodA: Period; periodB: Period };

function doPeriodsOverlap(periodA: Period, periodB: Period): boolean {
	if (periodA.day !== periodB.day) {
		return false;
	}

	let smaller: Period;
	let bigger: Period;

	if (periodA.duration < periodB.duration) {
		smaller = periodA;
		bigger = periodB;
	} else {
		smaller = periodB;
		bigger = periodA;
	}

	const smallerEndTime = smaller.startTime + smaller.duration;

	if (smaller.startTime > bigger.startTime && smaller.startTime < bigger.startTime + bigger.duration) {
		return true;
	}
	if (smallerEndTime > bigger.startTime && smallerEndTime < bigger.startTime + bigger.duration) {
		return true;
	}

	return false;
}

export function doesPeriodArrayOverlap(periods: Period[]): boolean {
	for (const periodA of periods) {
		for (const periodB of periods) {
			if (periodA === periodB) continue;
			if (doPeriodsOverlap(periodA, periodB)) {
				return true;
			}
		}
	}
	return false;
}

export function doSectionsOverlap(sectionA: Section, sectionB: Section): boolean {
	const allPeriods: Period[] = sectionA.periods.concat(sectionA.periods);

	return doesPeriodArrayOverlap(allPeriods);
}

export function doesSectionArrayOverlap(sections: Section[]): boolean {
	for (const sectionA of sections) {
		for (const sectionB of sections) {
			if (sectionA === sectionB) continue;
			if (doSectionsOverlap(sectionA, sectionB)) {
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

function addClassToSchedule(schedule: Schedule, cl: Class, sections: Section[]): void {
	schedule.registeredClasses.push({ class: cl, registeredSections: sections });
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

		if (!doesSectionArrayOverlap(sectionsAttempt)) {
			const possibleSchedule: Schedule = { registeredClasses: [] };
			for (const cl of classes) {
				const classSections: Section[] = sectionsAttempt.filter(
					(section: Section) => section.className === cl.description.name,
				);
				addClassToSchedule(possibleSchedule, cl, classSections);
			}
			possibleSchedules.push(possibleSchedule);
		}
	} while (stepIndexArray(sectionGroupIndexes, maxSectionGroupIndexes));

	return possibleSchedules;
}
