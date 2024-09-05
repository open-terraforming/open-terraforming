export type Fail<TError> = { ok: false; error: TError }

export const fail = <TError>(error: TError): Fail<TError> => ({
	ok: false,
	error,
})
