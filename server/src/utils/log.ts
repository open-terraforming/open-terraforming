/* eslint-disable @typescript-eslint/no-explicit-any */
import c from 'chalk'
import { isRunningInJest } from './isRunningInJest'

export class Logger {
	category: string

	constructor(category: string) {
		this.category = category
	}

	get prefix() {
		return (
			c.gray(new Date().toISOString().substr(11)) + ' ' + c.green(this.category)
		)
	}

	log(...args: any[]) {
		if (this.isLoggingDisabled()) {
			return
		}

		console.log(this.prefix, ...args)
	}

	info(...args: any[]) {
		if (this.isLoggingDisabled()) {
			return
		}

		console.info(this.prefix, ...args)
	}

	warn(...args: any[]) {
		if (this.isLoggingDisabled()) {
			return
		}

		console.warn(this.prefix, ...args)
	}

	trace(...args: any[]) {
		if (this.isLoggingDisabled()) {
			return
		}

		console.trace(this.prefix, ...args)
	}

	error(...args: any[]) {
		if (this.isLoggingDisabled()) {
			return
		}

		console.error(this.prefix, ...args)
	}

	group(...args: any[]) {
		if (this.isLoggingDisabled()) {
			return
		}

		console.group(this.prefix, ...args)
	}

	groupCollapsed(...args: any[]) {
		if (this.isLoggingDisabled()) {
			return
		}

		console.groupCollapsed(this.prefix, ...args)
	}

	groupEnd() {
		if (this.isLoggingDisabled()) {
			return
		}

		console.groupEnd()
	}

	private isLoggingDisabled() {
		return isRunningInJest()
	}
}
