export type Day = "M" | "T" | "W" | "Th" | "F" | "S" | "Su";

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

export type SectionType = "Lecture" | "Lab" | "Discussion"

/**
 * INVARIANTS:
 *
 * - name cannot be empty
 * - periods.length > 0
 *
 * - The periods in periods must follow the Period invariants
 * - No two periods in periods can be the same
 */
export type Section = { number: number; type: SectionType, periods: Period[] };

/**
 * INVARIANTS:
 *
 * - name cannot be empty
 */
export type FacultyName = "Arts" | "Science";

/**
 * INVARIANTS:
 *
 * - name cannot be empty
 */
export type SubjectCode = "PHYS" | "CPSC" | "MATH" | "ENGL" | "APSC" | "BIOL" | "CHEM" | "COMM";

/**
 * INVARIANTS:
 *
 * - name cannot be empty
 * - number cannot be empty
 * - description cannot be empty
 * 
 * - no prerequisite can have a prerequisite that requires this class down the line
 * 
 * - sections.length > 0, cannot contain duplicate section.
 * - mandatorySectionTypes.length > 0, cannot contain duplicate section types
 */
export type ClassInfo = { name: string; number: string, subjectCode: SubjectCode, description: string, prerequisites: Class[], corequisites: Class[], facultyName: FacultyName, sections: Section[], mandatorySectionTypes: SectionType[]};

/**
 * INVARIANTS:
 *
 * - info must satisfy all Info invariants
 * 
 * - registeredSections is either empty, or contains one section in info.sections for each mandatorySectionType
 * - registeredSections can be the same
 * - all sections in chosenSections must satisfy all Section invariants
 */
export type Class = { info: ClassInfo; registeredSections: Section[] };

/**
 * INVARIANTS:
 *
 * - classes.length > 0
 * - classes.periods.length === 1
 * - No periods overlap
 */
export type Schedule = { classes: Class[] };
