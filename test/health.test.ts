import { describe, expect, test } from "vitest";
import { dispatch } from "../src/server/framework/router";
import { routes } from "../src/server/routes";
import type { AppService } from "../src/server/service";

// An example endpoint You won't need this until Phase 2,
// so you can comment this out for now if you would like.

describe("GET /health", () => {
	test("reports the service name", async () => {
		const service: AppService = { name: "test" };
		const response = await dispatch(routes, service, "GET", "/health", undefined);
		expect(response.status).to.equal(200);
		expect(response.body).to.deep.equal({ ok: true, service: "test" });
	});

	test("an unknown path is a 404 with an error body", async () => {
		const service: AppService = { name: "test" };
		const response = await dispatch(routes, service, "GET", "/nothing", undefined);
		expect(response.status).to.equal(404);
		expect(response.body).to.have.property("error").that.is.a("string");
	});
});
