import { describe, expect, test } from "vitest";
import { makePeriod } from "../src/constructors.ts";
import { Period, Class } from "../src/types.ts";
import {err, ok, Result} from "../src/result.ts"


// An example endpoint You won't need this until Phase 2,
// so you can comment this out for now if you would like.

describe("makePeriod", () => {
	
	const startTimesA = [1, 1, 4, 4, 5]
	const durationsA = []

	test("empty name returns err", async () => {
		expect.soft(makePeriod("", "M", 1, 2)).toEqual(err("name is empty"))
	});

	test("startTime value return err if incorrect", async () => {
		expect.soft(makePeriod("101", "M", 24, 1)).toEqual(err("startTime === 24"))
		expect.soft(makePeriod("101", "M", -1, 1)).toEqual(err("startTime < 0"))
		expect.soft(makePeriod("101", "M", 40, 1)).toEqual(err("startTime > 24"))
	});

	test("duration value return err if incorrect", async () => {
		expect.soft(makePeriod("101", "M", 5, 0)).toEqual(err("duration === 0"))
		expect.soft(makePeriod("101", "M", 5, -1)).toEqual(err("duration < 0"))
		
	});

	test("endTime value return err if incorrect", async () => {
		expect.soft(makePeriod("101", "M", 23, 61)).toEqual(err("endTime > 24"))
	});

		
	
	
});
