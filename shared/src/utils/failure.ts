export type Failure<TError> = { ok: false; error: TError }

export const failure = <TError>(error: TError): Failure<TError> => ({
	ok: false,
	error,
})
