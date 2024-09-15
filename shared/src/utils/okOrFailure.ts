export type OkOrFailure<TValue, TError> =
	| { ok: true; value: TValue }
	| { ok: false; error: TError }
