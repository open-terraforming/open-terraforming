/* eslint-disable @typescript-eslint/no-explicit-any */
import { Logger } from './logger'

export class NullLogger implements Logger {
	log() {}

	info() {}

	warn() {}

	trace() {}

	error() {}

	group() {}

	groupCollapsed() {}

	groupEnd() {}

	child() {
		return new NullLogger()
	}

	duplicate() {
		return new NullLogger()
	}

	setCategory() {}
}
