import { describe, expect, test } from "vitest";
import { makePeriod } from "../src/constructors.ts";
import {} from "../src/main.ts";
import { err, ok, Result } from "../src/result.ts";
import { Class, Period } from "../src/types.ts";

// An example endpoint You won't need this until Phase 2,
// so you can comment this out for now if you would like.

describe("getAmountOfPossibleSchedules", () => {
	const _physPeriods: Period[] = [
		{ day: "M", startTime: 1, duration: 90 },
		{ day: "M", startTime: 2.5, duration: 90 },
		{ day: "T", startTime: 1, duration: 90 },
	];

	const _mathPeriods: Period[] = [
		{ day: "W", startTime: 1, duration: 90 },
		{ day: "W", startTime: 2.5, duration: 90 },
		{ day: "Th", startTime: 1, duration: 90 },
		{ day: "Th", startTime: 2.5, duration: 90 },
	];

	const _coscPeriods: Period[] = [
		{ day: "M", startTime: 1, duration: 90 },
		{ day: "M", startTime: 2.5, duration: 90 },
		{ day: "F", startTime: 1, duration: 90 },
		{ day: "F", startTime: 2.5, duration: 90 },
		{ day: "F", startTime: 4, duration: 90 },
	];
});
