import { access } from "node:fs/promises";
import { context } from "esbuild";
import { startServer } from "./server/framework/server";
import { routes } from "./server/routes";
import { startService } from "./server/service";

/**
 * This file is only necessary for Phase 2 and Phase 3.
 *
 * Starts your project server: `pnpm start`.
 *
 * Builds the service (src/server/service.ts) and starts the REST server on
 * port 3000 (or the PORT environment variable). Uses the routes in
 * src/server/routes.ts, serving any static files in public/. If src/browser.ts exists, it is
 * bundled into public/app.js and rebuilt whenever a source file changes.
 *
 * You can open http://localhost:3000/ in a browser once the server is running.
 */

/** The frontend's entry point. Bundled into public/app.js when it exists. */
const BROWSER_ENTRY = "src/browser.ts";

/**
 * Whether a file exists at `path`.
 *
 * @param path the file to look for
 * @returns true when it can be accessed, false otherwise
 */
async function fileExists(path: string): Promise<boolean> {
	try {
		await access(path);
		return true;
	} catch {
		return false;
	}
}

/**
 * Bundles the frontend into public/app.js and keeps rebuilding it as source
 * files change. Doesn't do anything until there is a frontend.
 *
 * @returns true when a bundler was started, false when BROWSER_ENTRY is absent
 */
async function bundleFrontend(): Promise<boolean> {
	if (!(await fileExists(BROWSER_ENTRY))) {
		return false;
	}
	const bundler = await context({
		entryPoints: [BROWSER_ENTRY],
		bundle: true,
		outfile: "public/app.js",
		sourcemap: true,
		format: "iife",
		target: "es2022",
		logLevel: "warning",
	});
	await bundler.watch();
	return true;
}

/**
 * Starts the bundler (if there is a frontend) and the server,
 * and prints where to find them.
 */
async function main(): Promise<void> {
	try {
		const port = Number(process.env.PORT ?? 3000);
		const service = await startService();
		const bundling = await bundleFrontend();
		startServer(routes, service, port, { staticDir: "public" });
		process.stdout.write("Server: http://localhost:" + port + "/  (try /health)\n");
		if (bundling) {
			process.stdout.write(
				"Bundling " + BROWSER_ENTRY + " into public/app.js on every change; reload the page after editing\n",
			);
		}
	} catch (error) {
		process.stderr.write("Could not start: " + String(error) + "\n");
		process.exitCode = 1;
	}
}

// Start the server when this file is executed directly.
main();
