# Class Planner

This file is where you will capture details about your 210 project. 

### Project Specification

An application where you can submit classes and all their possible periodsThe application will show you which periods conflict if promted. You will be able to stor all the classes and periods in a compact variable.


## User Interview

I asked a friend at UBC what they wish existed to help them plan their courses.

The main wish was not having to go through every possible combination of courses just to find one that works, some application that cound do that automatically and let me decide would be very useful.

Instead of focusing on organising the classes and periods, i will also add the functionallity to have it find possible scedules with the classes given.

## User Stories

### Story 1: Adding a new class

#### Statement

> As someone working at a school, I want to add a new class with a description and sections, so that it is available for students to schedule.

#### Success Criteria

- Adding a class with a valid code, level, description, and at least one valid section makes it available to get

#### Error Criteria

- Adding a class whose name already exists, has no sections or an invalid section throws an error


### Story 2: Editing a class description and sections once made

#### Statement

> As someone working at a school, I want to edit an existing class's description and sections, so that I can correct or update it without recreating it.

#### Success Criteria

- Updating a class's description, title or sections makes the changes visible when got

#### Error Criteria

- Editing a class that does not exist, or changing its name/code, is refused and the class stays as it was.


### Story 3: Create a User and add classes taken/wanted

#### Statement

> As a user, I want to create an account and record which classes I have taken and which I want, so that my schedule can be planned around them.

#### Success Criteria

- Creating a user with a unique id and adding existing classes to their taken and wanted lists makes those lists show up when the user is fetched.

#### Error Criteria

- Creating a duplicate user, or listing a class that does not exist (or one that is both taken and wanted), is refused and nothing is changed.


### Story 4: Get all possible schedules for a user

#### Statement

> As a user, I want to see every possible schedule for the classes I want, so that I can choose one that fits.

#### Success Criteria

- Requesting schedules for a user returns every combination of one section per wanted class that has no time conflicts (an empty list if none exist).

#### Error Criteria

- Requesting schedules for a user that does not exist is refused with an error.

### Story 5: Save My Work Automatically

#### Statement

> As a user, I want every accepted change saved to disk, so that nothing I did is lost if the server restarts.

#### Success Criteria

- After a request that changes state succeeds, the full users and classes data is written to the save file before the response is sent.

#### Error Criteria

- If the save file cannot be written, the user receives a server-error response saying the changes could not be saved.


### Story 6: Pick Up Where I Left Off

#### Statement

> As a user, I want my earlier work restored when the application starts, so that I can continue where I left off.

#### Success Criteria

- On startup, the saved users and classes are restored as they were saved, or the application starts empty if there is no save file.

#### Error Criteria

- If the save file is unreadable, not valid JSON, the wrong shape, or would break a collection rule, the application refuses to start and says what is wrong.


### Story 7: Removing classes and users

#### Statement

> As a user, I want to remove a class or a user I no longer need, so that the data stays clean and accurate.

#### Success Criteria

- Removing an existing class or user makes it disappear from lists and lookups, and any taken or wanted entries pointing at a removed class are cleaned up.

#### Error Criteria

- Removing a class or user that does not exist is refused and nothing is changed.


### Story 8: Choosing a schedule

#### Statement

> As a user, I want to pick one schedule from my possible schedules and have it kept for me, so that I can commit to a plan.

#### Success Criteria

- Choosing one of the user's possible schedules stores it on the user, and it is returned when the user is fetched.

#### Error Criteria

- Choosing a schedule that is not one of the user's current possible schedules (for example, it has a time conflict or includes a class they did not want) is refused and the previous choice stays.