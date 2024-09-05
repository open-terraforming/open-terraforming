import { Fail } from './fail'
import { Ok } from './ok'
import { OkOrFail } from './okOrFail'

export const isFail = <TValue, TError>(
	input: OkOrFail<TValue, TError> | Ok<TValue> | Fail<TError>,
): input is Fail<TError> => !input.ok
