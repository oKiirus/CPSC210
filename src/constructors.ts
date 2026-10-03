import {Period, Class, Day, Schedule} from "./types.ts"
import {err, ok, Result} from "./result.ts"

export function makePeriod(initName: string, initDay: Day, initStartTime: number, initDuration: number) : Result<Period, string>{
    if(initName === ""){
        return err("name is empty");
    }

    if(initStartTime < 0) return err("startTime < 0");
    if(initStartTime === 24) return err("startTime === 24");
    if(initStartTime > 24) return err("startTime > 24");



    if(initDuration < 0) return err("duration < 0");
    if(initDuration === 0) return err("duration === 0");
    if(initStartTime + (initDuration / 60) > 24) return err("endTime > 24");

    

    return ok({name: initName, day: initDay, startTime: initStartTime, duration: initDuration})
}

export function makeClass(initName: string, initPeriods: Period[]) : Result<Class, string>{
    if(initName === ""){
        return err("name is empty");
    }
    if(initPeriods.length === 0){
        return err("periods.length === 0");
    }

    return ok({name: initName, periods: initPeriods})
}

