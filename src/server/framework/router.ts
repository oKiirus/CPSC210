/**
 * The course-provided REST framework, as used in Labs 3 and 4. You will not
 * need this until Phase 2 of the project, when you implement your server.
 *
 * A handler is a function that processes a request record into a response record. The
 * framework matches a URL to a route, pulls out
 * path parameters and query parameters, and (in `server.ts`) listens for HTTP
 * requests.
 *
 * You should not need to change anything in this directory.
 */

/** The request methods the framework routes. Anything else is answered 405 by the server. */
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

/**
 * What a handler receives.
 *
 * For example, the request `GET /stations/tofino/readings?day=12`, matched by
 * the route pattern "/stations/:id/readings", arrives as:
 *
 *   {
 *     method: "GET",
 *     path: "/stations/tofino/readings",
 *     params: { id: "tofino" },   // the :id segment of the pattern
 *     query: { day: "12" },       // the part after "?", as strings
 *     body: undefined             // a GET has no body
 *   }
 *
 * and `POST /stations/tofino/readings` with the JSON text
 * {"day": 31, "hour": 0, "height": 2.5, "phase": "new"} arrives as:
 *
 *   {
 *     method: "POST",
 *     path: "/stations/tofino/readings",
 *     params: { id: "tofino" },
 *     query: {},                  // no "?" in the URL
 *     body: { day: 31, hour: 0, height: 2.5, phase: "new" }
 *   }
 *
 * What a handler reads from it:
 * - `request.params.id`: the `:id` from the path, always a string, always
 *   present when the route has an `:id` segment. Whether a station with that
 *   id exists is the handler's question, not the framework's.
 * - `request.query.<name>`: a query-string parameter, always a string. It is
 *   `"12"` for `?day=12`, `""` for `?day=` with nothing after it, and
 *   `undefined` when the parameter was not supplied at all. Turning it into a
 *   number, and deciding whether that number is acceptable, is the handler's
 *   job.
 * - `request.body`: for a POST, whatever JSON.parse made of the request's
 *   text: an object, an array, a number, a string, `null`, or `undefined`
 *   when there was no body. Nothing about its shape has been checked, which
 *   is why its type is `unknown`: the handler (through validate.ts) has to
 *   establish what it is before reading a field.
 * - `method` and `path`: already used by the router to choose this handler;
 *   a handler rarely needs them.
 *
 * INVARIANTS (you can trust that these all hold):
 * - params holds one string per `:name` segment in the matched route pattern,
 *   URL-decoded
 * - query holds the query-string parameters as strings; a parameter that was
 *   not supplied is absent (reads as undefined), and `?day=` gives ""
 * - body is the parsed JSON body of the request, or undefined when there
 *   was none; nothing about its shape has been checked
 */
export type HttpRequest = {
	method: HttpMethod;
	path: string;
	params: Record<string, string>;
	query: Partial<Record<string, string>>;
	body: unknown;
};

/**
 * What a handler returns: an HTTP status code and a JSON-serialisable body.
 */
export type HttpResponse = {
	status: number;
	body: unknown;
};

/**
 * The body every failure response carries.
 */
export type ErrorBody = {
	error: string;
};

/**
 * A handler. This validates the request, delegates to the model, and translates
 * the answer into a response. Can return either a value or a Promise.
 */
export type Handler<Service> = (request: HttpRequest, service: Service) => HttpResponse | Promise<HttpResponse>;

/**
 * One row of the route table: `pattern` is a path with `:name` segments.
 */
export type Route<Service> = {
	method: HttpMethod;
	pattern: string;
	handler: Handler<Service>;
};

/**
 * Success response.
 *
 * @param status the HTTP status code, usually 200 or 201.
 * @param body the JSON-serialisable body of the response.
 * @returns a response record to return from a handler.
 */
export function respond(status: number, body: unknown): HttpResponse {
	return { status: status, body: body };
}

/**
 * Failure response, carrying the standard error body.
 *
 * @param status the HTTP status error code.
 * @param message the error message.
 * @returns a response record to return from a handler.
 */
export function fail(status: number, message: string): HttpResponse {
	const body: ErrorBody = { error: message };
	return { status: status, body: body };
}

/**
 * Default response handler for an unwritten endpoint.
 */
export function notImplemented(name: string): Promise<HttpResponse> {
	return Promise.resolve(fail(501, name + " is not implemented"));
}

/**
 * Gets the path part of a URL, without its query string.
 */
export function pathOf(url: string): string {
	const index = url.indexOf("?");
	return index < 0 ? url : url.slice(0, index);
}

/**
 * Gets the non-empty segments of a path: "/a//b/" gives ["a", "b"].
 */
function segmentsOf(path: string): string[] {
	return path.split("/").filter((segment: string): boolean => segment !== "");
}

/**
 * Matches a path against a route pattern.
 *
 * @param pattern a route pattern such as "/stations/:id/readings".
 * @param path a request path such as "/stations/tofino/readings".
 * @returns the captured `:name` parameters when the path matches; undefined
 *   when it does not.
 */
export function matchPattern(pattern: string, path: string): Record<string, string> | undefined {
	const patternParts = segmentsOf(pattern);
	const pathParts = segmentsOf(path);
	if (patternParts.length !== pathParts.length) {
		return undefined;
	}
	const params: Record<string, string> = {};
	for (const [index, part] of patternParts.entries()) {
		const actual = pathParts[index];
		if (part.startsWith(":")) {
			params[part.slice(1)] = decodeURIComponent(actual);
		} else if (part !== actual) {
			return undefined;
		}
	}
	return params;
}

/**
 * The query-string parameters of a URL, as strings.
 * A repeated parameter only reports its last value.
 */
export function parseQuery(url: string): Partial<Record<string, string>> {
	const index = url.indexOf("?");
	if (index < 0) {
		return {};
	}
	const query: Partial<Record<string, string>> = {};
	for (const [key, value] of new URLSearchParams(url.slice(index + 1))) {
		query[key] = value;
	}
	return query;
}

/**
 * Routes one request to the first matching handler and returns its response.
 *
 * A URL that matches no route is a 404. A handler that throws (synchronously
 * or by rejecting) is a 500.
 *
 * @param routes the route table.
 * @param service the application state handlers are given.
 * @param method the request method.
 * @param url the request path plus query string, e.g. "/stations/x?day=3".
 * @param body the parsed JSON body, or undefined.
 */
export async function dispatch<Service>(
	routes: Route<Service>[],
	service: Service,
	method: HttpMethod,
	url: string,
	body: unknown,
): Promise<HttpResponse> {
	const path = pathOf(url);
	const match = findRoute(routes, method, path);
	if (match === undefined) {
		return fail(404, "no route matches " + method + " " + path);
	}
	const request: HttpRequest = { method, path, params: match.params, query: parseQuery(url), body };
	return await match.route.handler(request, service);
}

/**
 * Finds the first route matching `method` and `path`,
 * with its captured parameters, or undefined.
 */
export function findRoute<Service>(
	routes: Route<Service>[],
	method: HttpMethod,
	path: string,
): { route: Route<Service>; params: Record<string, string> } | undefined {
	for (const route of routes) {
		if (route.method !== method) {
			continue;
		}
		const params = matchPattern(route.pattern, path);
		if (params !== undefined) {
			return { route: route, params: params };
		}
	}
	return undefined;
}
