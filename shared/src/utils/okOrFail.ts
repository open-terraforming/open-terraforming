export type OkOrFail<TValue, TError> =
	| { ok: true; value: TValue }
	| { ok: false; error: TError }
