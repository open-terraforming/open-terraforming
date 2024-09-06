import { Failure } from './failure'
import { Ok } from './ok'
import { OkOrFailure } from './okOrFailure'

export const isFailure = <TValue, TError>(
	input: OkOrFailure<TValue, TError> | Ok<TValue> | Failure<TError>,
): input is Failure<TError> => !input.ok
