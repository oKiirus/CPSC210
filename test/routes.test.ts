import { describe, expect, test } from "vitest";
import { dispatch } from "../src/server/framework/router";
import { routes } from "../src/server/routes";
import type { AppService } from "../src/server/service";

// An example endpoint You won't need this until Phase 2,
// so you can comment this out for now if you would like.

describe("POST /signup", () => {
	test("Signs up user with unique name", async () => {
		
        const service: AppService = { 
		path: "hi",
		currentUser: undefined,
		users: [],
		classes: [],

	};

		const response = await dispatch(routes, service, "POST", "/users/signup", "Bob");

		expect(response.status).to.equal(200);
		expect(response.body).to.deep.equal({ ok: true, service: "Successfully added user: Bob" });
	});

    test("Fails to signup user already signed up", async () => {
		
        const service: AppService = { 
			path: "hi",
		currentUser: undefined,
		users: [],
		classes: [],

	};

        await dispatch(routes, service, "POST", "/users/signup", "Bob");
		const response = await dispatch(routes, service, "POST", "/users/signup", "Bob");

		expect(response.status).to.equal(409);
		expect(response.body).to.deep.equal({ error: "User already exists with that name" });
	});

    test("Fails to signup user already signed up", async () => {
		
        const service: AppService = { 
			path: "hi",
		currentUser: undefined,
		users: [],
		classes: [],
		
	};

		const response = await dispatch(routes, service, "POST", "/users/signup", 1);

		expect(response.status).to.equal(400);
		expect(response.body).to.deep.equal({ error: "Name must be a string" });
	});
});
