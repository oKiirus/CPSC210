import { describe, expect, test } from "vitest";
import { dispatch } from "../src/server/framework/router";
import { routes } from "../src/server/routes";
import { loadService, saveService, type AppService } from "../src/server/service";
import { Class, Day, Period, Schedule, Section, SectionGroup, User } from "../src/classes.ts";

// An example endpoint You won't need this until Phase 2,
// so you can comment this out for now if you would like.

describe("saveService", () => {
	test("Signs up user with unique name", async () => {
		
        const service: AppService = { 
        path: "src/database/mainService.json",
		currentUser: undefined,
		users: [new User("Bob")],
		classes: [],
        };

		saveService(service)
	});

});

describe("loadService", () => {
	test("Signs up user with unique name", async () => {
		
        const service: AppService = await loadService("src/database/mainService.json")

        expect(service).to.deep.equal({ 
        path: "src/database/mainService.json",
		currentUser: undefined,
		users: [new User("Bob")],
		classes: [],
        })
	});

});
