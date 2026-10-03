import {Period, Class, Day, Schedule} from "./types.ts"
import {err, ok, Result} from "./result.ts"
import {makePeriod, makeClass} from "./constructors.ts"

type Confliction = {periodA: Period, periodB: Class}


export function findPossibleSchedules(classes: Class[]) : Schedule[] {
    return [];
}

export function getPeriodPossibiliy(i: number, classes: Class[]) : number[]{
    const amountOfPeriods: number[] = classes.map((cl : Class) => cl.periods.length)
    return [];

}

export function getAmountOfPossibleSchedules(classes: Class[]): number { //Done
    const amountOfPeriods: number[] = classes.map((cl : Class) => cl.periods.length)

    return amountOfPeriods.reduce((mult: number, amount: number) => {
        return mult * amount;
    })
}

export function checkConflict(periodA: Period, periodB: Period) : boolean {
    if(periodA.day !== periodB.day){
        return false;
    }


    let smaller : Period;
    let bigger : Period;

    if(periodA.duration < periodB.duration) {
        smaller = periodA;
        bigger = periodB;
    } else {
        smaller = periodB;
        bigger = periodA;
    }

    const smallerEndTime = smaller.startTime + smaller.duration;

    if(smaller.startTime > bigger.startTime && smaller.startTime < bigger.startTime + bigger.duration){
        return true;
    }
    if(smallerEndTime > bigger.startTime && smallerEndTime < bigger.startTime + bigger.duration){
        return true;
    }

    return false
}