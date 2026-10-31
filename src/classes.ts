import { hasDuplicates } from "./helper.ts";
import { doPeriodsOverlap, doSectionsOverlap } from "./main.ts";
import { err, ok, Result } from "./result.ts";
import { generatePossibleSchedules } from './main';

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
export class Period { 
	public readonly day: Day;
	public readonly startTime: number;
	public readonly duration: number;

	constructor(day: Day, startTime: number, duration: number) {
		
		if (startTime < 0) throw new Error("startTime < 0");
		if (startTime === 24) throw new Error("startTime === 24");
		if (startTime > 24) throw new Error("startTime > 24");

		if (duration < 0) throw new Error("duration < 0");
		if (duration === 0) throw new Error("duration === 0");
		if (startTime + duration / 60 > 24) throw new Error("endTime > 24");

		this.day = day
		this.startTime = startTime
		this.duration = duration
	}

	checkOverlap(otherPeriod : Period) : boolean {
		if (this.day !== otherPeriod.day) {
				return false;
			}
		
			let smaller: Period;
			let bigger: Period;
		
			if (this.duration < otherPeriod.duration) {
				smaller = this;
				bigger = otherPeriod;
			} else {
				smaller = otherPeriod;
				bigger = this;
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
}

/**
 * INVARIANTS:
 *
 * - periods.length > 0
 *
 * - The periods in periods must follow the Period invariants
 * - No two periods in periods can be the same
 */
export class Section { 
	public readonly className: string; 
	public readonly sectionNumber: number; 
	public readonly type: SectionType; 
	public readonly periods: Period[] 

	constructor(className: string, sectionNumber: number, type: SectionType, periods: Period[] ) {

		if (doPeriodsOverlap(periods)) throw new Error("periods conflict");

	const periodDuplicates: number[] = hasDuplicates<Period>(periods);
	if (periodDuplicates.length > 0) {
		throw new Error(periodDuplicates[0] + " and " + periodDuplicates[1] + " sections are identical");
	}

		this.className = className
		this.sectionNumber = sectionNumber
		this.type = type
		this.periods = periods
	}

	checkOverlap(otherSection : Section) : boolean {
		const allPeriods: Period[] = this.periods.concat(otherSection.periods);

		return doPeriodsOverlap(allPeriods);
	}

	public getType(): SectionType {
    	return this.type;
	}
};

/**
 * INVARIANTS:
 *
 * - sections.length > 0
 *
 * - each section must have the type the group has
 * - sections cant be the same
 */
export class SectionGroup { 
	public readonly type: SectionType; 
	public readonly sections: Section[];

	constructor(type: SectionType, sections: Section[] ) {

		if(sections.length === 0) throw new Error("sections.length === 0");

		if(doSectionsOverlap(sections)) throw new Error("Duplicate sections");

		for(const section of sections) {
			if(section.getType() !== type) throw new Error("section.type !== type");
		}

		this.type = type
		this.sections = sections
	}
};

/**
 * - title cannot be empty
 * - description cannot be empty
 * - name must be in the form "{subjectCode}{level}"
 */
export class ClassDescription {
	public readonly title: string;
	public readonly name: string;
	public readonly subjectCode: SubjectCode;
	public readonly level: number;
	public readonly description: string;
	public readonly facultyName: FacultyName;

	constructor (title: string, name: string, subjectCode: SubjectCode, level: number, description: string, facultyName: FacultyName) {
		if(title === "") throw new Error("title is empty");
		if(description === "") throw new Error("description is empty");

		this.title = title
		this.name = name
		this.subjectCode = subjectCode
		this.level = level
		this.description = description
		this.facultyName = facultyName
	}

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
export class Class {
	public readonly description: ClassDescription;
	public readonly sectionGroups: SectionGroup[];
	public readonly mandatorySectionTypes: SectionType[];
	public readonly prerequisites: string[];
	public readonly corequisites: string[];

	constructor(description: ClassDescription, sectionGroups: SectionGroup[], mandatorySectionTypes: SectionType[], prerequisites: Class[], corequisites: Class[]) {

		if (sectionGroups.length <= 0) throw new Error("sectionGroups.length <= 0");

		for (const sectionGroup of sectionGroups) {
			const sections: Section[] = sectionGroup.sections;

			const sectionDuplicates: number[] = hasDuplicates<Section>(sections);
			if (sectionDuplicates.length > 0) {
				throw new Error(sectionDuplicates[0] + " and " + sectionDuplicates[1] + " sections are identical");
			}

			for (const section of sections) {
				if (section.className !== description.name) throw new Error("section.className !== description.name");

				if (section.type !== sectionGroup.type) throw new Error("section.type !== sectionGroup.type");
			}
		}

		if (mandatorySectionTypes.length <= 0) throw new Error("mandatorySectionTypes.length <= 0");

		const sectionTypeDuplicates: number[] = hasDuplicates<SectionType>(mandatorySectionTypes);
		if (sectionTypeDuplicates.length > 0) {
			throw new Error(sectionTypeDuplicates[0] + " and " + sectionTypeDuplicates[1] + " section types are identical");
		}

		const prerequisiteNames: string[] = prerequisites.map((prerequisite: Class) => prerequisite.description.name);

		if (prerequisiteNames.find((prerequisiteName: string) => prerequisiteName === description.name)) {
			throw new Error("This class is a prerequisite");
		}

		const corequisiteNames: string[] = corequisites.map((corequisite: Class) => corequisite.description.name);

		if (corequisiteNames.find((corequisiteName: string) => corequisiteName === description.name)) {
			throw new Error("This class is a corequisite");
		}

		this.description = description
		this.sectionGroups = sectionGroups
		this.mandatorySectionTypes = mandatorySectionTypes
		this.prerequisites = prerequisiteNames
		this.corequisites = corequisiteNames
	}
};

/**
 * INVARIANTS:
 *
 * - classes.length > 0
 * - classes.periods.length === 1
 * - No sections overlap
 *
 */
export class Schedule { 
	private registeredClasses: { class: Class; registeredSections: Section[] }[] = []

	addClass(cl: Class, sections: Section[]) : void{
		for(const otherClass of this.registeredClasses){
			const combinedSections : Section[] = otherClass.registeredSections.concat(sections)
			if(doSectionsOverlap(combinedSections)){
				throw new Error("sections overlap");
			}

			if(cl.description.name === otherClass.class.description.name) {
				throw new Error("duplicate class");
			}
		}

		this.registeredClasses.push({ class: cl, registeredSections: sections });
	}
	
};

export class User {
	private name : string
	private classesTaken : Class[] = []
	private classesWanted : Class[] = []
	private possibleSchedules : Schedule[] = []

	constructor(name : string){
		this.name = name
	}

	getName() : string {
		return this.name;
	}

	addTakenClass(cl : Class){
		this.classesTaken.push(cl)
	}

	removeTakenClass(cl : string){
		const newClassesTaken : Class[] = this.classesTaken.filter((currentClass : Class) => currentClass.description.name !== cl)
		if(newClassesTaken.length === this.classesTaken.length) {
			throw new Error("Class is not taken")
		}
		this.classesTaken = newClassesTaken
	}

	addWantedClass(cl : Class){
		this.classesWanted.push(cl)
	}

	removeWantedClass(cl : string){
		const newClassesWanted : Class[] = this.classesWanted.filter((currentClass : Class) => currentClass.description.name !== cl)
		if(newClassesWanted.length === this.classesWanted.length) {
			throw new Error("Class is not wanted")
		}
		this.classesWanted = newClassesWanted
	}

	generatePossibleSchedules() : void {
		this.possibleSchedules = generatePossibleSchedules(this.classesWanted)
	}

	getPossibleSchedules() {
		return this.possibleSchedules
	}
}