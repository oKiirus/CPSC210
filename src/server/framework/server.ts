import { readFile } from "node:fs/promises";
import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import { extname, resolve as resolvePath, sep } from "node:path";
import type { Result } from "../../result";
import { dispatch, fail, findRoute, type HttpMethod, type HttpResponse, pathOf, type Route } from "./router";

/**
 * The framework's HTTP listener. It turns requests into the request records
 * handlers expect, and writes their responses back as JSON. Tests should not
 * use the listener; they call `dispatch` directly instead.
 *
 * Beyond the routes, the listener also handles CORS and static file serving,
 * so handlers never have to manage these themselves. Anything in `staticDir`
 * whose path matches no route will be served.
 *
 * You should not need to modify this file.
 */
export type ServerOptions = {
	/** Send permissive CORS headers and answer preflight requests. Defaults to true. */
	cors?: boolean;
	/** A directory of files to serve for GETs that match no route. "/" serves index.html. */
	staticDir?: string;
};

/**
 * Content types for static files, by extension. Anything else is
 * served as octet-stream.
 */
const CONTENT_TYPES: Record<string, string> = {
	".html": "text/html; charset=utf-8",
	".css": "text/css; charset=utf-8",
	".js": "text/javascript; charset=utf-8",
	".mjs": "text/javascript; charset=utf-8",
	".json": "application/json",
	".svg": "image/svg+xml",
	".png": "image/png",
	".ico": "image/x-icon",
	".txt": "text/plain; charset=utf-8",
};

/** A response whose body is raw bytes with a content type, rather than JSON. */
type FileResponse = { status: number; contentType: string; content: Buffer };

/**
 * Collects a request's body as one UTF-8 string.
 *
 * @param request the incoming HTTP request.
 * @returns the whole body, or the empty string when there was none.
 */
function readBody(request: IncomingMessage): Promise<string> {
	return new Promise((resolve, reject): void => {
		const chunks: Buffer[] = [];
		request.on("data", (chunk: Buffer): void => {
			chunks.push(chunk);
		});
		request.on("end", (): void => {
			resolve(Buffer.concat(chunks).toString("utf8"));
		});
		request.on("error", reject);
	});
}

/**
 * Parses a request body as JSON.
 *
 * @param text the raw body.
 * @returns ok with the parsed value (undefined for an empty body), or an error
 *   when the text is not valid JSON.
 */
function parseBody(text: string): Result<unknown, string> {
	if (text === "") {
		return { ok: true, value: undefined };
	}
	try {
		return { ok: true, value: JSON.parse(text) };
	} catch {
		return { ok: false, error: "request body is not valid JSON" };
	}
}

/** The methods `dispatch` accepts. A request's method is matched against these. */
const METHODS: HttpMethod[] = ["GET", "POST", "PUT", "DELETE"];

/**
 * Reads the file under `staticDir` that `path` names, refusing any path that
 * resolves outside the directory.
 *
 * @param staticDir the directory files are served from.
 * @param path the request path; a trailing "/" means its index.html.
 * @returns the file's bytes and content type, a 403 for a path outside the
 *   directory, or a 404 for a missing file.
 */
async function serveFile(staticDir: string, path: string): Promise<FileResponse | HttpResponse> {
	const relative = path.endsWith("/") ? path + "index.html" : path;
	const root = resolvePath(staticDir);
	const file = resolvePath(root, "." + decodeURIComponent(relative));
	if (!file.startsWith(root + sep)) {
		return fail(403, "path is outside the static directory");
	}
	try {
		const content = await readFile(file);
		return { status: 200, contentType: CONTENT_TYPES[extname(file)] ?? "application/octet-stream", content: content };
	} catch {
		return fail(404, "no route or file matches GET " + path);
	}
}

/**
 * Handles a single API request. Parses the body, dispatches to the matching
 * handler, and turns any unhandled exception into a 500.
 *
 * @param routes the route table.
 * @param service the application state handlers are given.
 * @param method the request method, already known to be one we route.
 * @param request the incoming HTTP request.
 * @returns the handler's response, a 400 for a body that is not JSON, or a
 *   500 for a handler that threw.
 */
async function handleApi<Service>(
	routes: Route<Service>[],
	service: Service,
	method: HttpMethod,
	request: IncomingMessage,
): Promise<HttpResponse> {
	const body = parseBody(await readBody(request));
	if (!body.ok) {
		return fail(400, body.error);
	}
	try {
		return await dispatch(routes, service, method, request.url ?? "/", body.value);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		return fail(500, "handler threw: " + message);
	}
}

/**
 * Decides how one request is handled: a CORS preflight, a static file, an
 * API call, or a 405 for an unroutable method.
 *
 * @param routes the route table.
 * @param service the application state handlers are given.
 * @param options the server's CORS and static-directory settings.
 * @param request the incoming HTTP request.
 * @returns a JSON response, or a file response for static content.
 */
function handle<Service>(
	routes: Route<Service>[],
	service: Service,
	options: ServerOptions,
	request: IncomingMessage,
): Promise<FileResponse | HttpResponse> {
	const name = request.method ?? "GET";
	const url = request.url ?? "/";
	if (name === "OPTIONS" && options.cors !== false) {
		return Promise.resolve({ status: 204, body: undefined });
	}
	const method = METHODS.find((known: HttpMethod): boolean => known === name);
	if (method === undefined) {
		return Promise.resolve(fail(405, "unsupported method " + name));
	}
	if (method === "GET" && options.staticDir !== undefined && findRoute(routes, method, pathOf(url)) === undefined) {
		return serveFile(options.staticDir, pathOf(url));
	}
	return handleApi(routes, service, method, request);
}

/**
 * Writes a response to the network: either a file's bytes with its content
 * type, or the body serialised as JSON. Adds the CORS headers when asked.
 *
 * @param response the outgoing HTTP response.
 * @param result what to send.
 * @param cors whether to add the CORS headers.
 */
function send(response: ServerResponse, result: FileResponse | HttpResponse, cors: boolean): void {
	if (cors) {
		response.setHeader("Access-Control-Allow-Origin", "*");
		response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
		response.setHeader("Access-Control-Allow-Headers", "Content-Type");
	}
	response.statusCode = result.status;
	if ("content" in result) {
		response.setHeader("Content-Type", result.contentType);
		response.end(result.content);
		return;
	}
	response.setHeader("Content-Type", "application/json");
	response.end(result.status === 204 ? undefined : JSON.stringify(result.body ?? null));
}

/**
 * Starts listening on `port`, routing every request through `routes`.
 *
 * @param routes the route table.
 * @param service the application state handlers are given.
 * @param port the TCP port to listen on.
 * @param options CORS (default on) and an optional static directory.
 * @returns the Node server, so a caller can close it.
 */
export function startServer<Service>(
	routes: Route<Service>[],
	service: Service,
	port: number,
	options: ServerOptions = {},
): Server {
	const cors = options.cors !== false;
	const server = createServer(async (request: IncomingMessage, response: ServerResponse): Promise<void> => {
		try {
			send(response, await handle(routes, service, options, request), cors);
		} catch (error) {
			send(response, fail(500, String(error)), cors);
		}
	});
	server.listen(port);
	return server;
}
