/**
 * The state your handlers work on. Every handler receives this state.
 *
 * Currently, just a name. In Phase 2, you can make it contain any model
 * elements you need to share across your system.
 */
export type AppService = {
	name: string;
};

/**
 * Builds the service the server runs with. `start.ts` calls it
 * when the server is started. In Phase 2, load saved state from
 * disk here. Tests build their own AppService to control their state.
 *
 * @returns the service handlers will be given
 */
export async function startService(): Promise<AppService> {
	await Promise.resolve(); // in Phase 2, load saved state here
	return { name: "210-project" };
}
