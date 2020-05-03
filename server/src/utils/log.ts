/* eslint-disable @typescript-eslint/no-explicit-any */
import c from 'chalk'

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
		console.log(this.prefix, ...args)
	}

	info(...args: any[]) {
		console.info(this.prefix, ...args)
	}

	warn(...args: any[]) {
		console.warn(this.prefix, ...args)
	}

	trace(...args: any[]) {
		console.trace(this.prefix, ...args)
	}

	error(...args: any[]) {
		console.error(this.prefix, ...args)
	}

	group(...args: any[]) {
		console.group(this.prefix, ...args)
	}

	groupCollapsed(...args: any[]) {
		console.groupCollapsed(this.prefix, ...args)
	}

	groupEnd() {
		console.groupEnd()
	}
}
