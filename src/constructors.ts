import { err, ok, Result } from "./result.ts";
import { Class, Day, Period, Schedule } from "./types.ts";

export function makePeriod(
	initDay: Day,
	initStartTime: number,
	initDuration: number,
): Result<Period, string> {

									
	if (initStartTime < 0) return err("startTime < 0");
	if (initStartTime === 24) return err("startTime === 24");
	if (initStartTime > 24) return err("startTime > 24");

	if (initDuration < 0) return err("duration < 0");
	if (initDuration === 0) return err("duration === 0");
	if (initStartTime + initDuration / 60 > 24) return err("endTime > 24");

	return ok({ day: initDay, startTime: initStartTime, duration: initDuration });
}



export function makeClass(initName: string, initPeriods: Period[]): Result<Class, string> {
	if (initName === "") {
		return err("name is empty");
	}
	if (initPeriods.length === 0) {
		return err("periods.length === 0");
	}

	return ok({ name: initName, periods: initPeriods });
}
