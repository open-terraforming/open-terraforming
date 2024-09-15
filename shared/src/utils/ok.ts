export type Ok<TResult> = { ok: true; value: TResult }

export function ok(): Ok<never>
export function ok<TResult>(result: TResult): Ok<TResult>

export function ok(result?: unknown): Ok<unknown> {
	return {
		ok: true,
		value: result,
	}
}
