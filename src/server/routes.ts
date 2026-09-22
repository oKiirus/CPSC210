import { type HttpRequest, type HttpResponse, type Route, respond } from "./framework/router";
import type { AppService } from "./service";

/**
 * The route table mapping routes to handlers. Routes are tried in order
 * and the first match is used. Add a row for each of your endpoints.
 */
export const routes: Route<AppService>[] = [{ method: "GET", pattern: "/health", handler: getHealth }];

/**
 * An example handler: GET /health reports the service name. Replace it with
 * your own handlers. A handler checks the request, calls the model in
 * `service`, and returns a response.
 */
export function getHealth(_request: HttpRequest, service: AppService): HttpResponse {
	return respond(200, { ok: true, service: service.name });
}
