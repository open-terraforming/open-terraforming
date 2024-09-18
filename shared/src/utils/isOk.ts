import { Failure } from './failure'
import { Ok } from './ok'
import { OkOrFailure } from './okOrFailure'

export const isOk = <TValue, TError>(
	input: OkOrFailure<TValue, TError> | Ok<TValue> | Failure<TError>,
): input is Ok<TValue> => input.ok
