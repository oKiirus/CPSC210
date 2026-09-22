/**
 * The outcome of a call that might fail: a success carrying a `value`, or a
 * failure carrying an `error`. When `.ok`, `.value` is available. When `.ok` is false, `.error` is available.
 */
export type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

/**
 * A value that may be absent: like Result, but with no error.
 */
export type Option<T> = { ok: true; value: T } | { ok: false };

/**
 * Success wrapper.
 */
export function ok<T>(value: T): Result<T, never> {
	return { ok: true, value: value };
}

/**
 * Error wrapper.
 */
export function err<E>(error: E): Result<never, E> {
	return { ok: false, error: error };
}
