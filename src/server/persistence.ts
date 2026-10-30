import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { err, ok, type Result } from "../result";

/**
 * Reads and parses a JSON file. A file that does not exist is ok with
 * `undefined`; a file that cannot be read or is not JSON is an error.
 * What the parsed value means is for the caller to check.
 *
 * @param {string} path the file to read
 * @returns {Promise<Result<unknown, string>>} ok with the parsed value, ok with
 *   `undefined` when there is no file at `path`, or an error naming the file
 *   and what went wrong
 */
export async function readJsonFile(path: string): Promise<Result<unknown, string>> {
    let text: string;
    try {
        text = await readFile(path, "utf8");
    } catch (error) {
        if (typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT") {
            return ok(undefined);
        }
        return err("could not read " + path + ": " + String(error));
    }
    try {
        return ok(JSON.parse(text));
    } catch {
        return err(path + " is not valid JSON");
    }
}

/**
 * Writes `value` to `path` as JSON, creating the directory if needed.
 *
 * @param {string} path the file to write
 * @param {unknown} value the value to save; it must survive `JSON.stringify`
 * @returns {Promise<Result<void, string>>} ok once the file is written, or an
 *   error naming the file and what went wrong
 */
export async function writeJsonFile(path: string, value: unknown): Promise<Result<void, string>> {
    try {
        await mkdir(dirname(path), { recursive: true });
        await writeFile(path, JSON.stringify(value, null, 2), "utf8");
        return ok(undefined);
    } catch (error) {
        return err("could not write " + path + ": " + String(error));
    }
}