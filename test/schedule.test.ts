import { describe, expect, test } from "vitest";
import { makePeriod } from "../src/constructors.ts";
import { getAmountOfPossibleSchedules } from "../src/schedule.ts";
import { Period, Class } from "../src/types.ts";
import {err, ok, Result} from "../src/result.ts"


// An example endpoint You won't need this until Phase 2,
// so you can comment this out for now if you would like.

describe("getAmountOfPossibleSchedules", () => {
	
     const physPeriods: Period[] = [
        {name: "100", day: "M", startTime: 1, duration: 90},
        {name: "101", day: "M", startTime: 2.5, duration: 90},
        {name: "102", day: "T", startTime: 1, duration: 90}
    ]

    const mathPeriods: Period[] = [
        {name: "100", day: "W", startTime: 1, duration: 90},
        {name: "101", day: "W", startTime: 2.5, duration: 90},
        {name: "102", day: "Th", startTime: 1, duration: 90},
        {name: "103", day: "Th", startTime: 2.5, duration: 90}
    ]

    const coscPeriods: Period[] = [
        {name: "100", day: "M", startTime: 1, duration: 90},
        {name: "101", day: "M", startTime: 2.5, duration: 90},
        {name: "102", day: "F", startTime: 1, duration: 90},
        {name: "103", day: "F", startTime: 2.5, duration: 90},
        {name: "104", day: "F", startTime: 4, duration: 90}
    ]

    const classes: Class[] = [
        {name: "PHYS", periods: physPeriods}, 
        {name: "MATH", periods: mathPeriods}, 
        {name: "COSC", periods: coscPeriods}, 
    ]

	test("returns correct value", async () => {
		expect.soft(getAmountOfPossibleSchedules(classes)).equal(3 * 4 * 5)
	});


	
	
});
