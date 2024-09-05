export type Ok<TResult> = { ok: true; value: TResult }

export const ok = <TResult>(result: TResult): Ok<TResult> => ({
	ok: true,
	value: result,
})
