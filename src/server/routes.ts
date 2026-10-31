import { type HttpRequest, type HttpResponse, type Route, respond, fail } from "./framework/router";
import type { AppService } from "./service";
import { Class, ClassDescription, SectionType, Day, Period, Schedule, Section, SectionGroup, User } from "../classes.ts";
import { ServerOptions } from './framework/server';

/**
 * The route table mapping routes to handlers. Routes are tried in order
 * and the first match is used. Add a row for each of your endpoints.
 */
export const routes: Route<AppService>[] = [
	{ method: "GET", pattern: "/health", handler: getHealth },

	{ method: "POST", pattern: "/users/signup", handler: signup },
	{ method: "POST", pattern: "/users/login", handler: login },

	/*
	{ method: "PUT", pattern: "/database/addClass", handler: addClass },

	
	{ method: "PUT", pattern: "/users/:user/addTakenClass", handler: addTakenClassToUser },
	{ method: "DELETE", pattern: "/users/:user/removeTakenClass", handler: removeTakenClassFromUser },
	{ method: "PUT", pattern: "/users/:user/addWantedClass", handler: addWantedClassToUser },
	{ method: "DELETE", pattern: "/users/:user/removeWantedClass", handler: removeWantedClassFromUser },
	{ method: "GET", pattern: "/users/:user/getPossibleSchedules?generate", handler: getPossibleSchedulesFromUser },


	
	{ method: "PUT", pattern: "/database/:class/addSection", handler: addSectionToClass },
	{ method: "PUT", pattern: "/database/:class/addPrerequisite", handler: addPrerequisiteToClass },
	{ method: "PUT", pattern: "/database/:class/setDescription", handler: setDescriptionOfClass },
	{ method: "PUT", pattern: "/database/:class/getDescription", handler: getDescriptionOfClass },
	*/
];

/**
 * An example handler: GET /health reports the service name. Replace it with
 * your own handlers. A handler checks the request, calls the model in
 * `service`, and returns a response.
 */
export function getHealth(_request: HttpRequest, service: AppService): HttpResponse {
	return respond(200, { ok: true, service: service.path });
}



/**
 *
 */
export function signup(request: HttpRequest, service: AppService): HttpResponse {
	if (typeof request.body !== "string") {
		return fail(400, "Name must be a string")
	} 

	const name : string = request.body

	for(const user of service.users) {
		if (user.getName() === name){
			return fail(409, "User already exists with that name")
		}
	}

	const newUser = new User(name)

	service.users.push(newUser)
	service.currentUser = newUser

	return respond(200, { ok: true, service: "Successfully added user: " + name });
}

export function login(request: HttpRequest, service: AppService): HttpResponse {
	if (typeof request.body !== "string") {
		return fail(400, "name must be a string")
	} 

	const name : string = request.body

	for(const user of service.users) {
		if (user.getName() === name){
			service.currentUser = user

			return respond(200, { ok: true, service: "Login successful for: " + name });
		}
	}

	return fail(409, "No user exists with that name")
}