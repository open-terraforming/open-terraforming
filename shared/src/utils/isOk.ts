import { Fail } from './fail'
import { Ok } from './ok'
import { OkOrFail } from './okOrFail'

export const isOk = <TValue, TError>(
	input: OkOrFail<TValue, TError> | Ok<TValue> | Fail<TError>,
): input is Ok<TValue> => input.ok
