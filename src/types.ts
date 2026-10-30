export type Day = "M" | "T" | "W" | "Th" | "F" | "S" | "Su";
export type SectionType = "Lecture" | "Lab" | "Discussion";
export type FacultyName = "Arts" | "Science";
export type SubjectCode = "PHYS" | "CPSC" | "MATH" | "ENGL" | "APSC" | "BIOL" | "CHEM" | "COMM";

/**
 * INVARIANTS:
 *
 * - days.length > 0
 * - startTimes.length == days.length
 * - durations.length == days.length
 *
 * - The numbers in startTimes must be from 0 to 24, excluding 24
 * - The numbers in durations must be from 0 to 60 exclusive
 */
export type Period = { day: Day; startTime: number; duration: number };

/**
 * INVARIANTS:
 *
 * - periods.length > 0
 *
 * - The periods in periods must follow the Period invariants
 * - No two periods in periods can be the same
 */
export type Section = { className: string; sectionNumber: number; type: SectionType; periods: Period[] };

/**
 * INVARIANTS:
 *
 * - sections.length > 0
 *
 * - each section must have the type the group has
 * - sections can be the same
 */
export type SectionGroup = { type: SectionType; sections: Section[] };

/**
 * - title cannot be empty
 * - description cannot be empty
 * - name must be in the form "subjectCode level"
 */
export type ClassDescription = {
	title: string;
	name: string;
	subjectCode: SubjectCode;
	level: string;
	description: string;
	facultyName: FacultyName;
};

/**
 * INVARIANTS:
 * 
 * - no prerequisite can have a prerequisite that requires this class down the line
 * 
 * - sectionGroups.length > 0

 * 
 * - mandatorySectionTypes.length > 0, cannot contain duplicate section types
 */
export type Class = {
	description: ClassDescription;
	sectionGroups: SectionGroup[];
	mandatorySectionTypes: SectionType[];
	prerequisites: string[];
	corequisites: string[];
};

/**
 * INVARIANTS:
 *
 * - classes.length > 0
 * - classes.periods.length === 1
 * - No sections overlap
 *
 */
export type Schedule = { registeredClasses: { class: Class; registeredSections: Section[] }[] };
