# Class Planner

This file is where you will capture details about your 210 project. 

### Project Specification

An application where you can submit classes and all their possible periodsThe application will show you which periods conflict if promted. You will be able to stor all the classes and periods in a compact variable.


## User Interview

I asked a friend at UBC what they wish existed to help them plan their courses.

The main wish was not having to go through every possible combination of courses just to find one that works, some application that cound do that automatically and let me decide would be very useful.

Instead of focusing on organising the classes and periods, i will also add the functionallity to have it find possible scedules with the classes given.

## User Stories

### Story 1: <Creating_Classes>

#### Statement

As a student at a university, I want to send in the periods for a class so that I can see what times the class can occur.

#### Success Criteria

* Given periods for a class, I want to submit them with a name for the class, so I can creae a compact object for the class

#### Error Criteria

* Given no periods, I recive an error saying there are no periods


### Story 2: <Creating_Periods>

#### Statement

As a student at a university, I want to send in the times for a period, so that I can create a period to add to a class


#### Success Criteria

* Given times for a periods, I want to submit them with a name to create a period, so I can create a compact object for the period

#### Error Criteria

* Given no times, I recive an error saying there are no times


### Story 3: <Possible_Periods>

#### Statement

As a student at a university, I want to know the possible combinations of classes, so I can know how many possible scedules are possible

#### Success Criteria

* Given 3 classes with 3, 4 and 5 periods, then I recieve that there are 105 possible combinations 


#### Error Criteria

* Given no periods, I recieve an error that there are no periods


### Story 4: <Conflict>

#### Statement

As a student at a university, I want to know if two periods conflict easily, so I can plan my scedule faster
#### Success Criteria

* Given two periods (5 - 7) and (6 - 8), I recieve the info that they conflict 

#### Error Criteria

* Given two courses with invalid times (-1 - 4) or (23 - 25), I recieve an error



