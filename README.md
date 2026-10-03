# Class Planner

This file is where you will capture details about your 210 project. 

### Project Specification

An application where you can submit classes and all their possible periodsThe application will show you which periods conflict if promted. You will be able to stor all the classes and periods in a compact variable.


## User Interview

I asked a friend at UBC what they wish existed to help them plan their courses.

The main wish was not having to go through every possible combination of courses just to find one that works, some application that cound do that automatically and let me decide would be very useful.

Instead of focusing on organising the classes and periods, i will also add the functionallity to have it find possible scedules with the classes given.

## User Stories

### Story 1: <Technical_Worker>

#### Statement

As a technical worker at a university, I want to be able to orgaize each students schedule into a compact format, so that I am able to check and modify each schedule with ease.

#### Success Criteria

* Given a students schedule with 5 classes and a period chosen for each, I am able to create a JSON file that contains all the info
* Given a array of student scedules, I am able to easily check if each schedule has no conflicting courses
* Given a students schedule, and the classes they have taken, I am able to easily check if they are able to take the classes in their schedule

#### Error Criteria

* Given a students schedule with 5 classes and multiple periods chosen for each, I recience an error saying that a class in a scedule cannot contain multiple periods


### Story 2: <Simple_Student>

#### Statement

As a student at a university, I want to send in the classes I want to take and their possible periods, so that I am able see every possible Scedule that has no conflicts


#### Success Criteria

* Given classes and their periods, I am able to see each possible scedule that can be achieved with the courses

#### Error Criteria

* Given classes without their periods, I get an error that says a class must contain a period


### Story 3: <Best_Schedule>

#### Statement

As a student at a university, I want to send in the possible scedules I could take, so that I get the schedules that maximise some value

#### Success Criteria

* Given the possible scedules I could take, I recieve the schedule(s) with the least/most total time at uni
* Given the possible scedules I could take, I recieve the schedule(s) with the least/most total days at uni

* Given the possible scedules I could take, I recieve the schedule(s) with the least/most total time at uni
* Given the possible scedules I could take, I recieve the schedule(s) with the least/most total days at uni

#### Error Criteria

* Given a scedule with conflicting courses, I recieve an error that says the scedule is invalid


### Story 4: <Filtering_Schedules>

#### Statement

As a student at a university, I want to send in the possible scedules I can take, so that I can filter out the scedules that conflict with my personal needs

#### Success Criteria

* Given the possible scedules I could take, I recieve all the scedules that have at most X days where I am at uni longer than some chosen time
* Given the possible scedules I could take, I recieve all the scedules that have at most X days where I am at uni shorter than some chosen time
* Given the possible scedules I could take, I recieve all the scedules where at least X courses start after some time
* Given the possible scedules I could take, I recieve all the scedules where at least X courses end before some time
* Given the possible scedules I could take, I recieve all the scedules where there are no courses that conflict with a chosen time period

#### Error Criteria

* Given a time period, or any time outside of a possible day, I recieve an error saying my time chosen is invalid



