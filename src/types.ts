

export type Day =  "M" | "T" | "W" | "Th" | "F" | "S" | "Su"

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
export type Period = {name: string, day: Day, startTime: number, duration: number}

/**
 * INVARIANTS: 
 * 
 * - periods.length > 0
 * - name cannot be empty
 */
export type Class = {name: string, periods: Period[]}


/**
 * INVARIANTS: 
 * 
 * - classes.length > 0
 * - classes.periods.length === 1
 * - No periods overlap
 */
export type Schedule = {classes: Class[]}