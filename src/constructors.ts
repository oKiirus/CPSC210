import { hasDuplicates } from "./helper.ts";
import { doesPeriodArrayOverlap, doesSectionArrayOverlap } from "./main.ts";
import { err, ok, Result } from "./result.ts";
import {
	Class,
	ClassDescription,
	Day,
	FacultyName,
	Period,
	Schedule,
	Section,
	SectionGroup,
	SectionType,
	SubjectCode,
} from "./types.ts";

export function makePeriod(initDay: Day, initStartTime: number, initDuration: number): Result<Period, string> {
	if (initStartTime < 0) return err("startTime < 0");
	if (initStartTime === 24) return err("startTime === 24");
	if (initStartTime > 24) return err("startTime > 24");

	if (initDuration < 0) return err("duration < 0");
	if (initDuration === 0) return err("duration === 0");
	if (initStartTime + initDuration / 60 > 24) return err("endTime > 24");

	return ok({ day: initDay, startTime: initStartTime, duration: initDuration });
}

export function makeSection(
	className: string,
	sectionNumber: number,
	type: SectionType,
	periods: Period[],
): Result<Section, string> {
	if (doesPeriodArrayOverlap(periods)) return err("periods conflict");

	const periodDuplicates: number[] = hasDuplicates<Period>(periods);
	if (periodDuplicates.length > 0) {
		return err(periodDuplicates[0] + " and " + periodDuplicates[1] + " sections are identical");
	}

	return ok({ className: className, sectionNumber: sectionNumber, type: type, periods: periods });
}

let e: Class;

export function makeClass(
	description: ClassDescription,
	sectionGroups: SectionGroup[],
	mandatorySectionTypes: SectionType[],
	prerequisites: Class[],
	corequisites: Class[],
): Result<Class, string> {
	if (sectionGroups.length <= 0) return err("sectionGroups.length <= 0");

	for (const sectionGroup of sectionGroups) {
		const sections: Section[] = sectionGroup.sections;

		const sectionDuplicates: number[] = hasDuplicates<Section>(sections);
		if (sectionDuplicates.length > 0) {
			return err(sectionDuplicates[0] + " and " + sectionDuplicates[1] + " sections are identical");
		}

		for (const section of sections) {
			if (section.className !== description.name) return err("section.className !== description.name");

			if (section.type !== sectionGroup.type) return err("section.type !== sectionGroup.type");
		}
	}

	if (mandatorySectionTypes.length <= 0) return err("mandatorySectionTypes.length <= 0");

	const sectionTypeDuplicates: number[] = hasDuplicates<SectionType>(mandatorySectionTypes);
	if (sectionTypeDuplicates.length > 0) {
		return err(sectionTypeDuplicates[0] + " and " + sectionTypeDuplicates[1] + " section types are identical");
	}

	const prerequisiteNames: string[] = prerequisites.map((prerequisite: Class) => prerequisite.description.name);

	if (prerequisiteNames.find((prerequisiteName: string) => prerequisiteName === description.name)) {
		return err("This class is a prerequisite");
	}

	const corequisiteNames: string[] = corequisites.map((corequisite: Class) => corequisite.description.name);

	if (corequisiteNames.find((corequisiteName: string) => corequisiteName === description.name)) {
		return err("This class is a corequisite");
	}

	return ok({
		description: description,
		prerequisites: prerequisiteNames,
		corequisites: corequisiteNames,
		sectionGroups: sectionGroups,
		mandatorySectionTypes: mandatorySectionTypes,
	});
}

export function makeClassDescription(
	title: string,
	subjectCode: SubjectCode,
	level: string,
	description: string,
	facultyName: FacultyName,
): Result<ClassDescription, string> {
	return ok({
		title: title,
		name: subjectCode + " " + level,
		subjectCode: subjectCode,
		level: level,
		description: description,
		facultyName: facultyName,
	});
}
