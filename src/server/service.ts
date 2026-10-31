import { err, ok, Result } from "../result.ts";
import { Class, Day, Period, Schedule, Section, SectionGroup, User } from "../classes.ts";
import { readJsonFile, writeJsonFile} from "./persistence.ts";

/**
 * The state your handlers work on. Every handler receives this state.
 *
 * Currently, just a name. In Phase 2, you can make it contain any model
 * elements you need to share across your system.
 */
export type AppService = {
	path: string
	currentUser: User | undefined
	users: User[]
	classes: Class[]
};

/**
 * Builds the service the server runs with. `start.ts` calls it
 * when the server is started. In Phase 2, load saved state from
 * disk here. Tests build their own AppService to control their state.
 *
 * @returns the service handlers will be given
 */
export async function startService(): Promise<AppService> {
	return await loadService("src/database/mainService.json")
}



export async function loadService(path: string): Promise<AppService> {
	
	const fileData = await readJsonFile(path)

	if(!fileData.ok){
		throw new Error(fileData.error)
	}

	const data = fileData.value;
    if (typeof data !== "object" || data === null) {
        throw new Error(path + " must contain a JSON object");
    }

    const raw = data as Record<string, unknown>;
    if (!Array.isArray(raw.users) || !Array.isArray(raw.classes)) {
        throw new Error(path + " must contain 'users' and 'classes' arrays");
    }

    return {
        path,
        currentUser: undefined,
        users: raw.users as User[],
        classes: raw.classes as Class[],
    };


}

export async function saveService(service : AppService) {
	
	const fileData = await writeJsonFile(service.path, service)

	if(!fileData.ok){
		throw new Error(fileData.error)
	}

}
