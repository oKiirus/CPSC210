# The REST Framework

This describes the REST framework in `src/server/framework/`. It is the same framework you used in Labs 3 and 4. It consists of two primary files:

| File | What it does |
|---|---|
| `router.ts` | The request and response types, route matching, and `dispatch`, which turns a URL into a handler call. |
| `server.ts` | The HTTP listener. It reads requests, calls `dispatch`, and writes JSON back. It also handles CORS and static files. |

Three files around it are yours:

| File | What it does |
|---|---|
| `src/server/service.ts` | `AppService`, the state your handlers work on, and `startService`, which builds it when the server starts. |
| `src/server/routes.ts` | Your handlers and the route table. |
| `test/` | Your tests. They call `dispatch` directly. |

`src/start.ts` connects them. You should not need to change it.

```
   HTTP request ──► server.ts ──► dispatch(routes, service, method, url, body)
                                      │  finds the route, fills in params and query
                                      ▼
                                 handler(request, service) ──► { status, body }
                                      ▲
   your tests ────────────────────────┘   (same dispatch, no HTTP)
```

## Types

### `HttpRequest`

What a handler receives. The framework has already split the request up, so a handler reads these fields rather than the URL.

```ts
type HttpRequest = {
  method: HttpMethod;                          // "GET" | "POST" | "PUT" | "DELETE"
  path: string;                                // "/items/42", without the query string
  params: Record<string, string>;              // one entry per :name in the matched pattern
  query: Partial<Record<string, string>>;      // query-string parameters, as strings
  body: unknown;                               // the parsed JSON body, or undefined
};
```

Two requests, as a handler for the pattern `/items/:id` sees them:

| Field | `GET /items/42?verbose=1` | `PUT /items/42` with body `{"name":"lamp"}` |
|---|---|---|
| `method` | `"GET"` | `"PUT"` |
| `path` | `"/items/42"` | `"/items/42"` |
| `params` | `{ id: "42" }` | `{ id: "42" }` |
| `query` | `{ verbose: "1" }` | `{}` |
| `body` | `undefined` | `{ name: "lamp" }` |

A handler reads a path parameter as `request.params.id`, a query parameter as `request.query.verbose`, and the request's data as `request.body`.

Rules:

* `params` has one entry per `:name` segment in the matched pattern, URL-decoded.
* `query` values are strings. A parameter that was not sent is `undefined`. A parameter sent with no value, as in `?day=`, is the empty string. The type is `string | undefined`, so you have to handle both.
* `body` is whatever `JSON.parse` produced. Nothing about its shape has been checked. It can be an object, an array, a number, `null`, or `undefined` when there was no body. Checking it is the handler's job.

Watch out for `Number`. `Number("abc")` is `NaN`, and `NaN` passes every range check because it is neither less than nor greater than anything. `Number("")` is `0`. Check `Number.isFinite`, and `Number.isInteger` when you need a whole number, before comparing.

### `HttpResponse`

What a handler returns.

```ts
type HttpResponse = { status: number; body: unknown };
```

The server serialises `body` as JSON. Tests compare it as a value. Every failure response in this course has the body `{ error: string }`.

### `Handler<Service>` and `Route<Service>`

```ts
type Handler<Service> = (request: HttpRequest, service: Service) => HttpResponse | Promise<HttpResponse>;
type Route<Service> = { method: HttpMethod; pattern: string; handler: Handler<Service> };
```

A handler is `async` only when it waits on something, such as a file. A handler that only reads memory is a plain function. `Service` is your application's state; here it is `AppService` from `src/server/service.ts`.

## Building responses

```ts
respond(200, [1, 2])     // { status: 200, body: [1, 2] }
fail(404, "nothing here") // { status: 404, body: { error: "nothing here" } }
```

`respond(status, body)` builds a success. `fail(status, message)` builds a failure with the standard error body. `notImplemented(name)` returns a promise of a `501`, for an endpoint you have declared but not written yet.

## The service

`src/server/service.ts` defines the state your handlers work on and the function that builds it:

```ts
export type AppService = { name: string };              // placeholder: replace with your model
export async function startService(): Promise<AppService>
```

`start.ts` calls `startService()` once and passes the result to every handler. In Phase 2, build your model here and load saved state from disk. Tests do not call `startService`; they build an `AppService` themselves so each test starts from known data.

## Writing a handler

A handler checks the request, calls the model in `service`, and returns a response. The example handler:

```ts
export function getHealth(_request: HttpRequest, service: AppService): HttpResponse {
  return respond(200, { ok: true, service: service.name });
}
```

A handler that looks something up by a path parameter:

```ts
function getItem(request: HttpRequest, service: AppService): HttpResponse {
  const found = service.items.find((item) => item.id === request.params.id);
  if (found === undefined) {
    return fail(404, "no item with id '" + request.params.id + "'");
  }
  return respond(200, found);
}
```

A handler that reads a query parameter checks the string first:

```ts
function listCheaperThan(request: HttpRequest, service: AppService): HttpResponse {
  const text = request.query.maxPrice;
  if (text === undefined || text === "") {
    return fail(400, "maxPrice is required");
  }
  const maxPrice = Number(text);
  if (!Number.isFinite(maxPrice)) {
    return fail(400, "maxPrice must be a number, got '" + text + "'");
  }
  return respond(200, service.items.filter((item) => item.price <= maxPrice));
}
```

A handler that changes state and saves it is `async`. It checks the body before reading from it. A body of the wrong shape is a `400`. A well-formed request the model refuses is a `409`:

```ts
async function renameItem(request: HttpRequest, service: AppService): Promise<HttpResponse> {
  const body = request.body;
  if (typeof body !== "object" || body === null || !("name" in body) || typeof body.name !== "string") {
    return fail(400, "body must be { name: string }");
  }
  const renamed = service.items.rename(request.params.id, body.name);   // a Result from your model
  if (!renamed.ok) {
    return fail(409, renamed.error);
  }
  await service.save();
  return respond(200, renamed.value);
}
```

Keep model logic in the model and status codes in the handlers.

## The route table

`src/server/routes.ts` holds the table. Routes are tried in order and the first match wins. A `:name` segment in a pattern matches any one path segment.

```ts
export const routes: Route<AppService>[] = [
  { method: "GET", pattern: "/health", handler: getHealth },
  { method: "GET", pattern: "/items", handler: listCheaperThan },
  { method: "GET", pattern: "/items/:id", handler: getItem },
  { method: "PUT", pattern: "/items/:id", handler: renameItem },
];
```

The matching functions are exported in case you need them:

```ts
matchPattern("/items/:id", "/items/42")   // { id: "42" }
matchPattern("/items/:id", "/items")      // undefined
parseQuery("/items?maxPrice=15&note=")    // { maxPrice: "15", note: "" }
```

## `dispatch`

```ts
dispatch(routes, service, method, url, body): Promise<HttpResponse>
```

`dispatch` splits `url` into path and query, finds the first route whose method and pattern match, builds the `HttpRequest`, calls the handler, and returns its response as a promise. Your tests call it directly. The server calls it for each request.

`dispatch` handles two cases itself:

* A URL that matches no route gets a `404` with the standard error body. No handler runs. A URL that matches a route but names an unknown `:id` does reach your handler, and that `404` is yours to return.
* A handler that throws is not caught here. In a test the exception fails the test, which is right: an exception at the boundary is a bug, not a response. The real server catches it and answers `500`.

## Testing

A test builds a service with known data, calls `dispatch` the way the server does, and checks the response. `test/health.test.ts` is the example:

```ts
import { describe, expect, test } from "vitest";
import { dispatch } from "../src/server/framework/router";
import { routes } from "../src/server/routes";
import type { AppService } from "../src/server/service";

describe("GET /health", () => {
  test("reports the service name", async () => {
    const service: AppService = { name: "test" };
    const response = await dispatch(routes, service, "GET", "/health", undefined);
    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal({ ok: true, service: "test" });
  });
});
```

Build a new service in each test, or in `beforeEach`, so tests do not affect each other. A test that needs a browser DOM (Phase 3) starts with the line `// @vitest-environment jsdom`, as the Lab 4 tests did; everything else runs in Node. To test a change of state, dispatch the request that changes it and then the request that shows it. When your service saves to disk, give each test its own temporary directory (`mkdtemp` from `node:fs/promises`) and remove it in `afterEach`.

Assertions you will use most, from vitest's chai-style `expect`:

| Assertion | Checks |
|---|---|
| `expect(x).to.equal(y)` | same primitive value, such as a status code |
| `expect(x).to.deep.equal(y)` | same structure and values, such as a body |
| `expect(x).to.have.property("error").that.is.a("string")` | a failure body |
| `expect(list).to.have.length(n)` | an array's length |
| `await expect(promise).rejects.toThrow()` | an async call that must fail |

`to.equal` on two arrays or objects compares identity and fails even when the contents match. Use `to.deep.equal` for bodies.

## Running a real server

```ts
startServer(routes, service, port, options?): Server
```

`src/start.ts` does this. Run `pnpm start`, then from another terminal:

```
curl http://localhost:3000/health
curl -X PUT -d '{"name":"lamp"}' http://localhost:3000/items/42
```

The server handles two things a browser frontend needs:

* CORS is on by default. Every response has `Access-Control-Allow-Origin: *`, and an `OPTIONS` request gets a `204`. Pass `{ cors: false }` to turn it off.
* Static files. `start.ts` passes `{ staticDir: "public" }`, so a `GET` that matches no route is served from `public/`. `/` serves `index.html`. A missing file is a `404` and a path outside the directory is a `403`. Routes take priority over files. Your Phase 3 page goes in `public/`, and when `src/browser.ts` exists, `start.ts` bundles it into `public/app.js`.

The server also answers `400` for a body that is not valid JSON and `500` for a handler that throws. Neither happens in tests, because tests pass `dispatch` a value rather than text, and exceptions reach the test.
